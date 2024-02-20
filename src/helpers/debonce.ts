export default function debounce(func: (...args: any[]) => void, delay: number = 100) {
  let timerId: ReturnType<typeof setTimeout>

  return function (...args: any[]) {
    clearTimeout(timerId)

    timerId = setTimeout(() => {
      func(...args)
    }, delay)
  }
}
