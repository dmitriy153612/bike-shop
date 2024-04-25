import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios, { type AxiosResponse } from 'axios'
import { BASE_API_URL, COLORS_PATH, SIZES_PATH, BRANDS_PATH } from '@/config'
import { type Color, type Size, type Brand } from '@/interfaces/CatalogInterfaces'

export const useFilterStore = defineStore('filterStore', () => {
  const colors = ref<Array<Color>>([])
  const isColorsLoading = ref<boolean>(false)
  const colorsError = ref<unknown>(null)

  const sizes = ref<Array<Size>>([])
  const isSizesLoading = ref<boolean>(false)
  const sizesError = ref<unknown>(null)

  const brands = ref<Array<Brand>>([])
  const isBrandsLoading = ref<boolean>(false)
  const brandsError = ref<unknown>(null)

  async function fetchColors(): Promise<void> {
    try {
      isColorsLoading.value = true
      const res: AxiosResponse<Color[]> = await axios.get(`${BASE_API_URL}${COLORS_PATH}`)
      colors.value = res.data
    } catch (err) {
      console.error(err)
      colorsError.value = err
    } finally {
      isColorsLoading.value = false
    }
  }

  async function fetchSizes(): Promise<void> {
    try {
      isSizesLoading.value = true
      const res: AxiosResponse<Size[]> = await axios.get(`${BASE_API_URL}${SIZES_PATH}`)
      sizes.value = res.data
    } catch (err) {
      console.error(err)
      sizesError.value = err
    } finally {
      isSizesLoading.value = false
    }
  }

  async function fetchBrands(): Promise<void> {
    try {
      isBrandsLoading.value = true
      const res: AxiosResponse<Brand[]> = await axios.get(`${BASE_API_URL}${BRANDS_PATH}`)
      brands.value = res.data
    } catch (err) {
      console.error(err)
      brandsError.value = err
    } finally {
      isBrandsLoading.value = false
    }
  }

  return {
    fetchColors,
    fetchSizes,
    fetchBrands,

    colors,
    sizes,
    brands,

    isColorsLoading,
    isSizesLoading,
    isBrandsLoading,

    colorsError,
    sizesError,
    brandsError
  }
})
