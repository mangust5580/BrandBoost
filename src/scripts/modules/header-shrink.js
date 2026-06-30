import { SELECTORS } from '../config/selectors.js'
import DomUtils from '../utils/dom.js'

const MOBILE_QUERY = '(max-width: 767px)'

class HeaderShrink {
  constructor({
    headerSelector = SELECTORS.header,
    scrolledClass = 'header--scrolled',
    threshold = 28,
  } = {}) {
    this.headerElement = DomUtils.query(headerSelector)
    if (!this.headerElement) return

    this.scrolledClass = scrolledClass
    this.threshold = threshold
    this.rafId = 0

    this.onScroll = this.onScroll.bind(this)
    this.onResize = this.onResize.bind(this)
    this.update = this.update.bind(this)

    this.init()
  }

  init() {
    this.update()
    window.addEventListener('scroll', this.onScroll, { passive: true })
    window.addEventListener('resize', this.onResize, { passive: true })
  }

  shouldShrink() {
    if (window.matchMedia(MOBILE_QUERY).matches) {
      return false
    }

    if (document.body.classList.contains('is-menu-open')) {
      return false
    }

    return window.scrollY > this.threshold
  }

  update() {
    const isScrolled = this.shouldShrink()
    this.headerElement.classList.toggle(this.scrolledClass, isScrolled)
  }

  onScroll() {
    if (this.rafId) return

    this.rafId = window.requestAnimationFrame(() => {
      this.rafId = 0
      this.update()
    })
  }

  onResize() {
    this.update()
  }

  destroy() {
    window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('resize', this.onResize)

    if (this.rafId) {
      window.cancelAnimationFrame(this.rafId)
      this.rafId = 0
    }
  }
}

export default HeaderShrink
