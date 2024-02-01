import { type Ref } from 'vue'

export default function validateEmail(email: string, emailErrorObj: Ref): void {
  if (!email) {
    emailErrorObj.value = 'Введите Email'
    return
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    emailErrorObj.value = 'Некорректный Email'
    return
  } else {
    emailErrorObj.value = ''
  }
}
