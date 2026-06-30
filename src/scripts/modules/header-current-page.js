import { SELECTORS } from '../config/selectors.js'
import DomUtils from '../utils/dom.js'

class HeaderCurrentPage {
  constructor({
    headerSelector = SELECTORS.header,
    navLinkSelector = SELECTORS.scrollSpy.navLinks,
    currentPageDataName = 'currentPage',
    homePageValue = 'home',
  } = {}) {
    this.headerElement = DomUtils.query(headerSelector)
    if (!this.headerElement) return

    this.navLinks = DomUtils.queryAll(navLinkSelector, this.headerElement)
    if (!this.navLinks.length) return

    this.currentPageDataName = currentPageDataName
    this.homePageValue = homePageValue

    this.init()
  }

  init() {
    const currentPage = this.resolveCurrentPage()
    if (!currentPage || currentPage === this.homePageValue) return

    const nextActiveLink = this.navLinks.find(link => link.dataset.navPage === currentPage)
    if (!nextActiveLink) return

    this.navLinks.forEach(link => {
      const isActive = link === nextActiveLink
      link.classList.toggle('is-active', isActive)

      if (isActive) {
        link.setAttribute('aria-current', 'page')
      } else {
        link.removeAttribute('aria-current')
      }
    })
  }

  resolveCurrentPage() {
    const declaredValue = this.headerElement.dataset[this.currentPageDataName]
    if (declaredValue && !declaredValue.startsWith('@')) return declaredValue

    const bodyPage = document.body?.dataset?.page
    const bodyToNavPage = {
      home: 'home',
      article: 'blog',
      privacy: 'none',
      terms: 'none',
      'thank-you': 'none',
    }

    return bodyToNavPage[bodyPage] || 'none'
  }
}

export default HeaderCurrentPage
