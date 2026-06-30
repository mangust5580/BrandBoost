import { BREAKPOINTS, CLASSES, KEYS, LABELS } from '../config/constants.js'
import { SELECTORS } from '../config/selectors.js'
import DomUtils from '../utils/dom.js'
import { FocusTrap, FocusUtils } from '../utils/focus.js'

class OverlayMenu {
  constructor(root = document) {
    const s = SELECTORS.overlayMenu

    if (DomUtils.isHTMLElement(root) && root.matches(s.root)) {
      this.rootElement = root
    } else {
      this.rootElement = DomUtils.query(s.root, root)
    }

    if (!this.rootElement) return

    this.panelElement = DomUtils.query(s.panel, this.rootElement)
    this.toggleButton = DomUtils.query(s.burgerButton, this.rootElement)
    this.backdropElement = DomUtils.query(s.backdrop, this.rootElement)

    this.navLinks = this.panelElement ? DomUtils.queryAll(s.navLinks, this.panelElement) : []
    this.pageContentElements = DomUtils.queryAll(SELECTORS.pageContent)

    this.desktopMedia = window.matchMedia(`(min-width: ${BREAKPOINTS.DESKTOP_MIN_WIDTH}px)`)

    this.bodyElement = document.body
    this.isOpen = false
    this.supportsInert = 'inert' in HTMLElement.prototype
    this.tabIndexBackup = new Map()

    this.closedBurgerLabel = this.toggleButton?.getAttribute('aria-label') || LABELS.menuClosed
    this.openedBurgerLabel =
      this.toggleButton?.getAttribute('data-menu-open-label') || LABELS.menuOpened

    this.onToggleClick = this.onToggleClick.bind(this)
    this.onBackdropClick = this.onBackdropClick.bind(this)
    this.onDocumentKeydown = this.onDocumentKeydown.bind(this)
    this.onNavLinkClick = this.onNavLinkClick.bind(this)
    this.onViewportChange = this.onViewportChange.bind(this)

    this.focusTrap = this.panelElement ? new FocusTrap(this.panelElement) : null

    this.init()
  }

  init() {
    if (!this.toggleButton || !this.panelElement) return

    this.syncPanelAccessibility()

    this.toggleButton.addEventListener('click', this.onToggleClick)
    this.backdropElement?.addEventListener('click', this.onBackdropClick)
    document.addEventListener('keydown', this.onDocumentKeydown)

    if (this.navLinks?.length) {
      this.navLinks.forEach(link => link.addEventListener('click', this.onNavLinkClick))
    }

    if (typeof this.desktopMedia.addEventListener === 'function') {
      this.desktopMedia.addEventListener('change', this.onViewportChange)
    } else {
      this.desktopMedia.addListener(this.onViewportChange)
    }
  }

  syncPanelAccessibility() {
    // Keep desktop navigation exposed to assistive technologies.
    if (this.desktopMedia.matches) {
      this.setPanelHidden(false)
      this.backdropElement?.setAttribute('aria-hidden', 'true')
      return
    }

    // On mobile, closed overlay navigation should stay hidden.
    if (!this.isOpen) {
      this.setPanelHidden(true)
      this.backdropElement?.setAttribute('aria-hidden', 'true')
    }
  }

  setPanelHidden(isHidden) {
    if (!this.panelElement) return

    this.panelElement.hidden = isHidden
    this.panelElement.inert = isHidden
    this.panelElement.removeAttribute('aria-hidden')
  }

  open() {
    if (this.isOpen) return
    this.isOpen = true

    this.rootElement.classList.add(CLASSES.isOpen)
    this.panelElement?.classList.add(CLASSES.isOpen)
    this.backdropElement?.classList.add(CLASSES.isOpen)
    this.toggleButton?.classList.add(CLASSES.isActive)

    this.toggleButton?.setAttribute('aria-expanded', 'true')
    this.toggleButton?.setAttribute('aria-label', this.openedBurgerLabel)
    this.setPanelHidden(false)
    this.backdropElement?.setAttribute('aria-hidden', 'false')

    this.bodyElement.classList.add(CLASSES.isMenuOpen)
    this.setPageContentInert(true)

    this.focusTrap?.activate()
    this.focusTrap?.focusInitial()
  }

  close({ restoreFocus = false } = {}) {
    if (!this.isOpen) return
    this.isOpen = false

    this.rootElement.classList.remove(CLASSES.isOpen)
    this.panelElement?.classList.remove(CLASSES.isOpen)
    this.backdropElement?.classList.remove(CLASSES.isOpen)
    this.toggleButton?.classList.remove(CLASSES.isActive)

    this.toggleButton?.setAttribute('aria-expanded', 'false')
    this.toggleButton?.setAttribute('aria-label', this.closedBurgerLabel)
    this.setPanelHidden(true)
    this.backdropElement?.setAttribute('aria-hidden', 'true')

    this.bodyElement.classList.remove(CLASSES.isMenuOpen)
    this.setPageContentInert(false)

    this.focusTrap?.deactivate()
    this.focusTrap?.cleanupTabIndex()

    if (restoreFocus) {
      this.toggleButton?.focus()
    }
  }

  toggle() {
    if (this.isOpen) this.close({ restoreFocus: true })
    else this.open()
  }

  setPageContentInert(isInert) {
    if (!this.pageContentElements?.length) return

    if (this.supportsInert) {
      this.pageContentElements.forEach(element => {
        element.inert = isInert
      })
      return
    }

    if (isInert) {
      this.tabIndexBackup.clear()

      this.pageContentElements.forEach(element => {
        element.setAttribute('aria-hidden', 'true')

        const focusables = FocusUtils.getFocusable(element)
        focusables.forEach(node => {
          const previousValue = node.getAttribute('tabindex')
          this.tabIndexBackup.set(node, previousValue)
          node.setAttribute('tabindex', '-1')
        })
      })
      return
    }

    this.pageContentElements.forEach(element => {
      element.removeAttribute('aria-hidden')
    })

    this.tabIndexBackup.forEach((previousValue, node) => {
      if (!node || !node.isConnected) return

      if (previousValue === null) {
        node.removeAttribute('tabindex')
      } else {
        node.setAttribute('tabindex', previousValue)
      }
    })

    this.tabIndexBackup.clear()
  }

  onToggleClick(event) {
    event.preventDefault()
    this.toggle()
  }

  onBackdropClick() {
    this.close()
  }

  onNavLinkClick() {
    this.close({ restoreFocus: true })
  }

  onDocumentKeydown(event) {
    if (!this.isOpen) return

    if (event.key === KEYS.ESC) {
      this.close({ restoreFocus: true })
    }
  }

  onViewportChange(event) {
    if (event.matches && this.isOpen) {
      this.close({ restoreFocus: false })
    }

    this.syncPanelAccessibility()
  }

  destroy() {
    this.toggleButton?.removeEventListener('click', this.onToggleClick)
    this.backdropElement?.removeEventListener('click', this.onBackdropClick)
    document.removeEventListener('keydown', this.onDocumentKeydown)

    if (this.navLinks?.length) {
      this.navLinks.forEach(link => link.removeEventListener('click', this.onNavLinkClick))
    }

    if (typeof this.desktopMedia.addEventListener === 'function') {
      this.desktopMedia.removeEventListener('change', this.onViewportChange)
    } else {
      this.desktopMedia.removeListener(this.onViewportChange)
    }

    this.close({ restoreFocus: false })
  }
}

export default OverlayMenu
