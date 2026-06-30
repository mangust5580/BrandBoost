import { KEYS } from '../config/constants.js'

const DEFAULT_FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

class FocusUtils {
  static getFocusable(container, selector = DEFAULT_FOCUSABLE_SELECTOR) {
    return Array.from(container.querySelectorAll(selector))
  }
}

class FocusTrap {
  constructor(container, { selector = DEFAULT_FOCUSABLE_SELECTOR } = {}) {
    this.container = container
    this.selector = selector
    this.focusableElements = []
    this.firstElement = null
    this.lastElement = null
    this.keydownHandler = null

    this.update = this.update.bind(this)
    this.handleKeydown = this.handleKeydown.bind(this)
  }

  update() {
    this.focusableElements = FocusUtils.getFocusable(this.container, this.selector)
    this.firstElement = this.focusableElements[0] || null
    this.lastElement = this.focusableElements[this.focusableElements.length - 1] || null
  }

  handleKeydown(event) {
    if (event.key !== KEYS.TAB) return

    if (!this.focusableElements.length) this.update()
    if (!this.firstElement || !this.lastElement) return

    const activeElement = document.activeElement
    if (event.shiftKey) {
      if (activeElement === this.firstElement) {
        event.preventDefault()
        this.lastElement.focus()
      }

      return
    }

    if (activeElement === this.lastElement) {
      event.preventDefault()
      this.firstElement.focus()
    }
  }

  activate() {
    this.update()
    this.keydownHandler = this.handleKeydown
    document.addEventListener('keydown', this.keydownHandler)
  }

  deactivate() {
    if (this.keydownHandler) {
      document.removeEventListener('keydown', this.keydownHandler)
      this.keydownHandler = null
    }

    this.focusableElements = []
    this.firstElement = null
    this.lastElement = null
  }

  focusInitial() {
    this.update()
    if (this.firstElement) {
      this.firstElement.focus()
      return
    }

    this.container.setAttribute('tabindex', '-1')
    this.container.focus()
  }

  cleanupTabIndex() {
    if (this.container.getAttribute('tabindex') === '-1') {
      this.container.removeAttribute('tabindex')
    }
  }
}

export { FocusTrap, FocusUtils }
