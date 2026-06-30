import DomUtils from '../utils/dom.js'

class ArticleProgress {
  constructor(root = document) {
    this.articleElement = DomUtils.query('[data-article-root]', root)
    this.progressBarElement = DomUtils.query('[data-reading-progress]', root)
    if (!this.articleElement || !this.progressBarElement) return

    this.onScroll = this.onScroll.bind(this)
    this.onResize = this.onResize.bind(this)
    this.update = this.update.bind(this)

    this.init()
  }

  init() {
    this.update()
    window.addEventListener('scroll', this.onScroll, { passive: true })
    window.addEventListener('resize', this.onResize)
  }

  clamp(value, min, max) {
    return Math.min(Math.max(value, min), max)
  }

  update() {
    const articleRect = this.articleElement.getBoundingClientRect()
    const scrollTop = window.scrollY || window.pageYOffset
    const viewportHeight = window.innerHeight || 1
    const articleTop = articleRect.top + scrollTop
    const articleBottom = articleTop + articleRect.height
    const startOffset = articleTop - viewportHeight * 0.25
    const endOffset = articleBottom - viewportHeight * 0.75
    const rawProgress = (scrollTop - startOffset) / Math.max(endOffset - startOffset, 1)
    const progress = this.clamp(rawProgress, 0, 1)

    this.progressBarElement.style.transform = `scaleX(${progress})`
  }

  onScroll() {
    this.update()
  }

  onResize() {
    this.update()
  }

  destroy() {
    window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('resize', this.onResize)
  }
}

export default ArticleProgress
