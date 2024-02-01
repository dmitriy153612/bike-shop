import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { BASE_API_URL, REGISTRATION_PATH } from '@/config'
import { type Registration } from '@/interfaces/LoginAndRegistrationInterfaces'

export const useRegistrationStore = defineStore('registrationStore', () => {
  const isLoading = ref<boolean>(false)
  const registrationSuccess = ref<boolean>(false)
  const error = ref<any>(null)

  function toggleRegistrationSuccess(value: boolean): void {
    registrationSuccess.value = value
  }

  async function fetchData({ email, password, passwordConfirm }: Registration): Promise<void> {
    toggleRegistrationSuccess(false)
    try {
      isLoading.value = true
      await axios.post(`${BASE_API_URL}${REGISTRATION_PATH}`, {
        email,
        password,
        passwordConfirm
      })

      toggleRegistrationSuccess(true)
    } catch (err) {
      console.log(err)
      error.value = err
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    registrationSuccess,
    error,
    fetchData,
    toggleRegistrationSuccess
  }
})
