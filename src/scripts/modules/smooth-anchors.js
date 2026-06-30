import { SELECTORS } from '../config/selectors.js'
import DomUtils from '../utils/dom.js'
import ScrollUtils from '../utils/scroll.js'

class SmoothAnchors {
  constructor({
    headerSelector = SELECTORS.header,
    linkSelector = 'a[href*="#"]',
  } = {}) {
    this.headerElement = DomUtils.query(headerSelector)
    this.linkSelector = linkSelector

    this.onDocumentClick = this.onDocumentClick.bind(this)
    this.init()
  }

  init() {
    document.addEventListener('click', this.onDocumentClick)
  }

  getOffset() {
    return ScrollUtils.getHeaderOffsetPx() || this.headerElement?.offsetHeight || 0
  }

  normalizePath(pathname) {
    const withoutTrailingSlash = pathname.replace(/\/+$/, '')
    if (!withoutTrailingSlash) return '/'
    return withoutTrailingSlash.replace(/\/index\.html$/i, '') || '/'
  }

  getTargetByHash(hash) {
    if (!hash) return null

    const id = hash.slice(1)
    if (id) {
      const byId = document.getElementById(decodeURIComponent(id))
      if (byId) return byId
    }

    try {
      return document.querySelector(hash)
    } catch {
      return null
    }
  }

  onDocumentClick(event) {
    const link = event.target.closest(this.linkSelector)
    if (!link) return

    const href = link.getAttribute('href')
    if (!href || href === '#') return

    let url
    try {
      url = new URL(link.href, window.location.href)
    } catch {
      return
    }

    const sameOrigin = url.origin === window.location.origin
    const samePath =
      this.normalizePath(url.pathname) === this.normalizePath(window.location.pathname)

    if (!sameOrigin || !samePath) return

    const hash = url.hash
    if (!hash) return

    const targetElement = this.getTargetByHash(hash)
    if (!targetElement) return

    event.preventDefault()

    const top = targetElement.getBoundingClientRect().top + window.scrollY - this.getOffset()
    const behavior = ScrollUtils.prefersReducedMotion() ? 'auto' : 'smooth'

    window.scrollTo({
      top: Math.max(0, top),
      behavior,
    })

    if (window.location.hash !== hash) {
      history.pushState(null, '', hash)
    }
  }

  destroy() {
    document.removeEventListener('click', this.onDocumentClick)
  }
}

export default SmoothAnchors
