class DomUtils {
  static query(selector, root = document) {
    return root.querySelector(selector)
  }

  static queryAll(selector, root = document) {
    return Array.from(root.querySelectorAll(selector))
  }

  static isHTMLElement(value) {
    return value instanceof HTMLElement
  }
}

export default DomUtils
