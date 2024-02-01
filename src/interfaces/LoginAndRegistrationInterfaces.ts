export interface Login {
  email: string
  password: string
}

export interface Registration extends Login {
  passwordConfirm: string
}

export interface User {
  token: string
  email: string
  userId: string
  cartAmount?: number
}
