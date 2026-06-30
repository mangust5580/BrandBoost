class ScrollUtils {
  static prefersReducedMotion() {
    return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
  }

  static getCssVarPx(varName, root = document.documentElement) {
    const raw = getComputedStyle(root).getPropertyValue(varName)
    const parsed = Number.parseFloat(raw)
    return Number.isFinite(parsed) ? parsed : 0
  }

  static getHeaderOffsetPx() {
    return ScrollUtils.getCssVarPx('--header-height') || ScrollUtils.getCssVarPx('--header-offset')
  }
}

export default ScrollUtils
