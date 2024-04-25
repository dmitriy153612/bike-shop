import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios, { type AxiosResponse } from 'axios'
import { BASE_API_URL, PRODUCT_PATH } from '@/config'
import { useGlobalStore } from '@/stores/globalStore'
import { type ProductDetail } from '@/interfaces/ProductInterfaces'

export const useProductStore = defineStore('productStore', () => {
  const globalStore = useGlobalStore()

  const product = ref<ProductDetail | null>(null)
  const isLoading = ref<boolean>(false)
  const error = ref<unknown>(null)

  async function fetchData({ id }: { id: string }): Promise<void> {
    try {
      error.value = null
      isLoading.value = true
      globalStore.showSpinner(true)
      const res: AxiosResponse<ProductDetail> = await axios.get(
        `${BASE_API_URL}${PRODUCT_PATH}/${id}`
      )
      product.value = res.data
    } catch (err) {
      console.error(err)
      error.value = err
    } finally {
      isLoading.value = false
      globalStore.showSpinner(false)
    }
  }
  return {
    product,
    isLoading,
    error,
    fetchData
  }
})
