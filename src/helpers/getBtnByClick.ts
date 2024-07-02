export function getBtnByClick(e: Event): HTMLButtonElement | HTMLAnchorElement | null {
  if (e.target instanceof Element) {
    const target: Element = e.target
    if (target.closest('button')) {
      return target.closest('button')
    } else if (target.closest('a')) {
      return target.closest('a')
    }
  }
  return null
}
