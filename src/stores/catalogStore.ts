import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios, { type AxiosResponse } from 'axios'
import { BASE_API_URL, CATALOG_PATH, CATALOG_PER_PAGE } from '@/config'
import { useGlobalStore } from '@/stores/globalStore'
import {
  type Product,
  type CatalogConfig,
  type FilterParams,
  type CatalogResponse
} from '@/interfaces/CatalogInterfaces'

export const useCatalogStore = defineStore('catalogStore', () => {
  const globalStore = useGlobalStore()

  const catalog = ref<Product[]>([])
  const config = ref<CatalogConfig | null>(null)
  const isLoading = ref<boolean>(false)
  const error = ref<unknown>(null)

  async function fetchCatalog(queryParams: FilterParams): Promise<void> {
    const params: FilterParams & { limit: number } = { ...queryParams, limit: CATALOG_PER_PAGE }
    try {
      isLoading.value = true
      globalStore.showSpinner(true)
      const res: AxiosResponse<CatalogResponse> = await axios.get(
        `${BASE_API_URL}${CATALOG_PATH}`,
        { params }
      )
      catalog.value = res.data.catalog
      config.value = res.data.config
    } catch (err) {
      console.log(err)
      error.value = err
    } finally {
      isLoading.value = false
      globalStore.showSpinner(false)
    }
  }
  return {
    catalog,
    config,
    isLoading,
    error,
    fetchCatalog
  }
})
