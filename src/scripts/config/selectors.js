export const SELECTORS = {
  header: '.header',
  pageContent: '[data-page-content]',

  overlayMenu: {
    root: '[data-js-overlay-menu]',
    panel: '[data-js-overlay-menu-panel]',
    burgerButton: '[data-js-overlay-menu-burger-button]',
    backdrop: '[data-js-overlay-menu-backdrop]',
    navLinks: '[data-js-nav-link]',
  },

  scrollSpy: {
    navLinks: '[data-js-nav-link]',
    homeLink: '[data-home-link]',
  },

  contactForm: {
    root: '[data-js-contact-form]',
    status: '[data-js-contact-form-status]',
    phone: '[data-js-contact-phone]',
    submit: '[data-js-contact-form-submit]',
    fields: 'input, textarea, select',
    fieldContainer: '.contact-form__field',
    fieldError: '[data-js-field-error]',
  },
}
