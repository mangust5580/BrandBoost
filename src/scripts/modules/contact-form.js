import { CLASSES, FORM_MESSAGES } from '../config/constants.js'
import { SELECTORS } from '../config/selectors.js'
import DomUtils from '../utils/dom.js'

const FORM_SELECTORS = SELECTORS.contactForm

class ContactFormPhoneFormatter {
  static getDigits(value) {
    return value.replace(/\D/g, '')
  }

  static formatRuPhone(value) {
    let digits = ContactFormPhoneFormatter.getDigits(value)
    if (!digits) return ''

    if (digits.startsWith('8')) digits = `7${digits.slice(1)}`
    if (!digits.startsWith('7')) digits = `7${digits}`

    digits = digits.slice(0, 11)

    const country = digits.slice(0, 1)
    const area = digits.slice(1, 4)
    const first = digits.slice(4, 7)
    const second = digits.slice(7, 9)
    const third = digits.slice(9, 11)

    let result = `+${country}`
    if (area) result += ` (${area}`
    if (area.length === 3) result += ')'
    if (first) result += ` ${first}`
    if (second) result += `-${second}`
    if (third) result += `-${third}`

    return result
  }
}

class ContactForm {
  constructor(formElement) {
    this.formElement = formElement
    this.statusElement = this.formElement.querySelector(FORM_SELECTORS.status)
    this.submitElement = this.formElement.querySelector(FORM_SELECTORS.submit)
    this.phoneElement = this.formElement.querySelector(FORM_SELECTORS.phone)

    this.onInvalid = this.onInvalid.bind(this)
    this.onInput = this.onInput.bind(this)
    this.onBlur = this.onBlur.bind(this)
    this.onSubmitRequest = this.onSubmitRequest.bind(this)

    this.init()
  }

  init() {
    this.formElement.addEventListener('invalid', this.onInvalid, true)
    this.formElement.addEventListener('input', this.onInput)
    this.formElement.addEventListener('blur', this.onBlur, true)
    this.formElement.addEventListener('submit', this.onSubmitRequest)
    this.submitElement?.addEventListener('click', this.onSubmitRequest)
  }

  setStatus(text = '', stateClass = '') {
    if (!this.statusElement) return

    this.statusElement.textContent = text
    this.statusElement.classList.remove(CLASSES.isError, CLASSES.isSuccess)
    if (stateClass) this.statusElement.classList.add(stateClass)
  }

  getFieldErrorElement(field) {
    const container = field.closest(FORM_SELECTORS.fieldContainer)
    if (!container) return null
    return container.querySelector(FORM_SELECTORS.fieldError)
  }

  setFieldError(field, message = '') {
    const errorElement = this.getFieldErrorElement(field)
    if (!errorElement) return

    errorElement.textContent = message
    errorElement.hidden = !message
  }

  getFieldErrorMessage(field) {
    if (
      !(
        field instanceof HTMLInputElement ||
        field instanceof HTMLTextAreaElement ||
        field instanceof HTMLSelectElement
      )
    ) {
      return FORM_MESSAGES.invalidField
    }

    if (field instanceof HTMLInputElement && field.type === 'checkbox') {
      return FORM_MESSAGES.checkboxRequired
    }

    if (field.validity.valueMissing) {
      return FORM_MESSAGES.requiredField
    }

    if (field.validity.typeMismatch && field.type === 'email') {
      return FORM_MESSAGES.invalidEmail
    }

    if (field.validity.customError) {
      return field.validationMessage
    }

    return FORM_MESSAGES.invalidField
  }

  syncPhoneValidation(field) {
    if (!(field instanceof HTMLInputElement) || field.type !== 'tel') return

    const digits = ContactFormPhoneFormatter.getDigits(field.value)
    if (!digits.length) {
      field.setCustomValidity('')
      return
    }

    field.setCustomValidity(digits.length === 11 ? '' : FORM_MESSAGES.incompletePhone)
  }

  setFieldInvalidState(field, isInvalid, message = '') {
    if (!field) return

    if (isInvalid) {
      field.setAttribute('aria-invalid', 'true')
      this.setFieldError(field, message)
      return
    }

    field.removeAttribute('aria-invalid')
    this.setFieldError(field, '')
  }

  normalizePhoneField(field) {
    if (!(field instanceof HTMLInputElement) || field !== this.phoneElement) return
    field.value = ContactFormPhoneFormatter.formatRuPhone(field.value)
    this.syncPhoneValidation(field)
  }

  onInvalid(event) {
    const field = event.target
    if (
      !(
        field instanceof HTMLInputElement ||
        field instanceof HTMLTextAreaElement ||
        field instanceof HTMLSelectElement
      )
    ) {
      return
    }

    this.setFieldInvalidState(field, true, this.getFieldErrorMessage(field))
    this.setStatus(FORM_MESSAGES.formInvalid, CLASSES.isError)
  }

  onInput(event) {
    const field = event.target
    if (
      !(
        field instanceof HTMLInputElement ||
        field instanceof HTMLTextAreaElement ||
        field instanceof HTMLSelectElement
      )
    ) {
      return
    }

    this.normalizePhoneField(field)

    if (field.validity.valid) {
      this.setFieldInvalidState(field, false, '')
    }
  }

  onBlur(event) {
    const field = event.target
    if (
      !(
        field instanceof HTMLInputElement ||
        field instanceof HTMLTextAreaElement ||
        field instanceof HTMLSelectElement
      )
    ) {
      return
    }

    this.normalizePhoneField(field)

    if (!field.value && !(field instanceof HTMLInputElement && field.type === 'checkbox')) {
      this.setFieldInvalidState(field, false, '')
      return
    }

    if (!field.validity.valid) {
      this.setFieldInvalidState(field, true, this.getFieldErrorMessage(field))
      return
    }

    this.setFieldInvalidState(field, false, '')
  }

  onSubmitRequest(event) {
    event.preventDefault()

    const fields = DomUtils.queryAll(FORM_SELECTORS.fields, this.formElement)
    fields.forEach(field => {
      this.normalizePhoneField(field)
      this.setFieldInvalidState(field, false, '')
    })

    if (!this.formElement.checkValidity()) {
      const firstInvalid = fields.find(field => !field.validity.valid)
      firstInvalid?.focus()

      if (firstInvalid) {
        this.setFieldInvalidState(firstInvalid, true, this.getFieldErrorMessage(firstInvalid))
      }

      this.setStatus(FORM_MESSAGES.formInvalid, CLASSES.isError)
      return
    }

    if (this.submitElement instanceof HTMLButtonElement) {
      this.submitElement.disabled = true
      this.submitElement.setAttribute('aria-disabled', 'true')
    }

    this.setStatus(FORM_MESSAGES.demoRedirect, CLASSES.isSuccess)
    window.location.assign('thank-you.html')
  }
}

class ContactFormsManager {
  constructor(root = document) {
    this.instances = []
    this.root = root
    this.init()
  }

  init() {
    const forms = DomUtils.queryAll(FORM_SELECTORS.root, this.root)
    if (!forms.length) return

    this.instances = forms.map(form => new ContactForm(form))
  }
}

export default ContactFormsManager
