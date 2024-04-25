export function lockScroll(isLock: boolean) {
  const body: HTMLElement = document.body
  const app: HTMLElement | null = document.getElementById('app')

  if (isLock) {
    body.style.overflowY = 'hidden'
    if (app) {
      app.style.overflowY = 'scroll'
    }
  } else {
    body.style.overflowY = ''
    if (app) {
      app.style.overflowY = ''
    }
  }
}
