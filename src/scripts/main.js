import HeaderOffset from './modules/header-offset.js'
import OverlayMenu from './modules/overlay-menu.js'
import SmoothAnchors from './modules/smooth-anchors.js'
import ScrollSpy from './modules/scroll-spy.js'
import ContactFormsManager from './modules/contact-form.js'
import ArticleProgress from './modules/article-progress.js'
import HeaderShrink from './modules/header-shrink.js'
import HeaderCurrentPage from './modules/header-current-page.js'
import DomUtils from './utils/dom.js'
import { SELECTORS } from './config/selectors.js'

class App {
  constructor(root = document) {
    this.root = root
    this.modules = []
    this.deferredModules = []
    this.init()
  }

  init() {
    this.modules.push(new HeaderCurrentPage())

    const overlayRoots = DomUtils.queryAll(SELECTORS.overlayMenu.root, this.root)
    overlayRoots.forEach(node => {
      this.modules.push(new OverlayMenu(node))
    })

    this.defer(() => {
      this.deferredModules.push(new HeaderShrink())
      this.deferredModules.push(new HeaderOffset())
      this.deferredModules.push(new SmoothAnchors())
      this.deferredModules.push(new ScrollSpy())
      this.deferredModules.push(new ContactFormsManager(this.root))
      this.deferredModules.push(new ArticleProgress(this.root))
    })
  }

  defer(callback) {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(callback, { timeout: 1200 })
      return
    }

    window.setTimeout(callback, 250)
  }
}

new App(document)
