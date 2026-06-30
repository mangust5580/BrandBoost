import { SELECTORS } from '../config/selectors.js'
import DomUtils from '../utils/dom.js'
import ScrollUtils from '../utils/scroll.js'

class ScrollSpy {
  constructor({
    headerSelector = SELECTORS.header,
    navLinkSelector = SELECTORS.scrollSpy.navLinks,
    homeLinkSelector = SELECTORS.scrollSpy.homeLink,
  } = {}) {
    this.headerElement = DomUtils.query(headerSelector)
    this.navLinks = DomUtils.queryAll(navLinkSelector)
    if (!this.navLinks.length) return

    this.headerOffset = 76
    this.homeLink = this.resolveHomeLink(homeLinkSelector)
    this.items = this.resolveItems()
    if (!this.items.length) return

    this.activeItem = undefined
    this.headerObserver = null
    this.scrollRaf = 0
    this.resizeRaf = 0

    this.onScroll = this.onScroll.bind(this)
    this.onResize = this.onResize.bind(this)
    this.onHeaderResize = this.onHeaderResize.bind(this)
    this.refreshMeasurements = this.refreshMeasurements.bind(this)
    this.updateActiveState = this.updateActiveState.bind(this)

    this.init()
  }

  init() {
    this.activateItem(null)
    this.onResize()

    window.addEventListener('scroll', this.onScroll, { passive: true })
    window.addEventListener('resize', this.onResize, { passive: true })
    window.addEventListener('load', this.onResize)
    window.addEventListener('hashchange', this.updateActiveState)

    if (this.headerElement && typeof ResizeObserver === 'function') {
      this.headerObserver = new ResizeObserver(this.onHeaderResize)
      this.headerObserver.observe(this.headerElement)
    }
  }

  resolveHomeLink(homeLinkSelector) {
    const explicit = DomUtils.query(homeLinkSelector)
    if (explicit) return explicit

    return (
      this.navLinks.find(link => {
        const hash = this.getHashFromLink(link)
        return !hash || hash === '#'
      }) || null
    )
  }

  resolveItems() {
    return this.navLinks
      .map(link => {
        const hash = this.getHashFromLink(link)
        if (!hash || hash === '#') return null

        const section = document.querySelector(hash)
        if (!section) return null

        return { link, hash, section }
      })
      .filter(Boolean)
  }

  getHashFromLink(link) {
    try {
      return new URL(link.href, window.location.href).hash || ''
    } catch {
      return ''
    }
  }

  setActiveLink(activeLink) {
    this.navLinks.forEach(link => {
      const isActive = link === activeLink
      link.classList.toggle('is-active', isActive)

      if (isActive) {
        link.setAttribute('aria-current', 'page')
      } else {
        link.removeAttribute('aria-current')
      }
    })
  }

  getActivationLineY() {
    return window.scrollY + this.headerOffset + 12
  }

  refreshMeasurements() {
    const scrollTop = window.scrollY || window.pageYOffset
    this.headerOffset =
      ScrollUtils.getHeaderOffsetPx() || this.headerElement?.offsetHeight || this.headerOffset

    this.items.forEach(item => {
      item.top = item.section.getBoundingClientRect().top + scrollTop
    })
  }

  activateItem(item) {
    if (this.activeItem === item) return

    this.activeItem = item
    this.setActiveLink(item ? item.link : this.homeLink)
  }

  updateActiveState() {
    const activationLineY = this.getActivationLineY()
    let nextActiveItem = null
    let topBoundary = -Infinity

    this.items.forEach(item => {
      const sectionTop = item.top ?? 0
      if (sectionTop <= activationLineY && sectionTop >= topBoundary) {
        topBoundary = sectionTop
        nextActiveItem = item
      }
    })

    if (nextActiveItem) {
      this.activateItem(nextActiveItem)
      return
    }

    this.activateItem(null)
  }

  onScroll() {
    if (this.scrollRaf) return

    this.scrollRaf = requestAnimationFrame(() => {
      this.scrollRaf = 0
      this.updateActiveState()
    })
  }

  onHeaderResize() {
    this.onResize()
  }

  onResize() {
    if (this.resizeRaf) return

    this.resizeRaf = requestAnimationFrame(() => {
      this.resizeRaf = 0
      this.refreshMeasurements()
      this.updateActiveState()
    })
  }

  destroy() {
    if (this.headerObserver) {
      this.headerObserver.disconnect()
      this.headerObserver = null
    }

    if (this.scrollRaf) {
      cancelAnimationFrame(this.scrollRaf)
      this.scrollRaf = 0
    }

    if (this.resizeRaf) {
      cancelAnimationFrame(this.resizeRaf)
      this.resizeRaf = 0
    }

    window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('resize', this.onResize)
    window.removeEventListener('load', this.onResize)
    window.removeEventListener('hashchange', this.updateActiveState)
  }
}

export default ScrollSpy
