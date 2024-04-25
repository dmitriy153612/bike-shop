import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios, { type AxiosResponse } from 'axios'
import { BASE_API_URL, LOGIN_PATH, CHECK_AUTH_PATH } from '@/config'
import { useCartStore } from '@/stores/cartStore'
import { useGlobalStore } from '@/stores/globalStore'
import { type Login, type User } from '@/interfaces/LoginAndRegistrationInterfaces'

export const useLoginStore = defineStore('loginStore', () => {
  const cartStore = useCartStore()
  const globalStore = useGlobalStore()

  const isLoginLoading = ref<boolean>(false)
  const isCheckAuthLoading = ref<boolean>(false)
  const error = ref<any>(null)
  const token = ref<string>('')
  const userEmail = ref<string>('')
  const userId = ref<string>('')

  function setUserDataFromLS(): void {
    const storeUserData: string | null = localStorage.getItem('userData')

    if (storeUserData) {
      const userData: User = JSON.parse(storeUserData)
      token.value = userData.token
      userEmail.value = userData.email
      userId.value = userData.userId
    }
  }

  function logout(): void {
    localStorage.removeItem('userData')
    token.value = ''
    userEmail.value = ''
    userId.value = ''
    error.value = null
    cartStore.clearCartData()
  }

  async function fetchCheckAuth(): Promise<void> {
    if (!token.value) {
      return
    }
    try {
      globalStore.showSpinner(true)
      isCheckAuthLoading.value = true
      const res: AxiosResponse<Required<User>> = await axios.get(
        `${BASE_API_URL}${CHECK_AUTH_PATH}`,
        {
          headers: {
            Authorization: `Bearer ${token.value}`
          }
        }
      )

      cartStore.setCartAmount(res.data.cartAmount)
      token.value = res.data.token
      userId.value = res.data.userId
      userEmail.value = res.data.email
    } catch (err) {
      console.error(err)
      error.value = err
      logout()
    } finally {
      isCheckAuthLoading.value = false
    }
  }

  async function fetchLogin({ email, password }: Login): Promise<void> {
    try {
      isLoginLoading.value = true
      const res: AxiosResponse<Required<User>> = await axios.post(`${BASE_API_URL}${LOGIN_PATH}`, {
        email,
        password
      })
      token.value = res.data.token
      userEmail.value = res.data.email
      userId.value = res.data.userId
      localStorage.setItem('userData', JSON.stringify(res.data))
      cartStore.setCartAmount(res.data.cartAmount)
    } catch (err) {
      console.error(err)
      error.value = err
    } finally {
      isLoginLoading.value = false
    }
  }
  return {
    isCheckAuthLoading,
    isLoginLoading,
    token,
    userEmail,
    error,
    userId,
    logout,
    setUserDataFromLS,
    fetchLogin,
    fetchCheckAuth
  }
})
