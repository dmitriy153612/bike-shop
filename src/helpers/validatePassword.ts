import { type Ref } from 'vue'

export default function validatePassword(password: string, passwordErrorObj: Ref): void {
  if (!password) {
    passwordErrorObj.value = 'Введите пароль'
    return
  } else if (password.length < 5) {
    passwordErrorObj.value = 'Неможет быть короче 5 символов'
    return
  } else if (/\s/.test(password)) {
    passwordErrorObj.value = 'Не может содержать пробелы'
  } else {
    passwordErrorObj.value = ''
  }
}
