import { SELECTORS } from '../config/selectors.js'
import DomUtils from '../utils/dom.js'

class HeaderOffset {
  constructor({
    headerSelector = SELECTORS.header,
    cssVarNames = ['--header-height', '--header-offset'],
  } = {}) {
    this.headerElement = DomUtils.query(headerSelector)
    if (!this.headerElement) return

    this.cssVarNames = cssVarNames
    this.rafId = 0
    this.resizeObserver = null

    this.scheduleApply = this.scheduleApply.bind(this)
    this.apply = this.apply.bind(this)

    this.init()
  }

  init() {
    window.addEventListener('resize', this.scheduleApply, { passive: true })
    window.addEventListener('load', this.scheduleApply)

    if (typeof ResizeObserver === 'function') {
      this.resizeObserver = new ResizeObserver(this.scheduleApply)
      this.resizeObserver.observe(this.headerElement)
    } else {
      this.scheduleApply()
    }
  }

  apply() {
    const height = Math.max(0, Math.round(this.headerElement.offsetHeight))

    this.cssVarNames.forEach(name => {
      document.documentElement.style.setProperty(name, `${height}px`)
    })
  }

  scheduleApply() {
    if (this.rafId) return

    this.rafId = window.requestAnimationFrame(() => {
      this.rafId = 0
      this.apply()
    })
  }

  destroy() {
    window.removeEventListener('resize', this.scheduleApply)
    window.removeEventListener('load', this.scheduleApply)

    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
      this.resizeObserver = null
    }

    if (this.rafId) {
      window.cancelAnimationFrame(this.rafId)
      this.rafId = 0
    }
  }
}

export default HeaderOffset
