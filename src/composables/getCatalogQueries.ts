import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCatalogStore } from '@/stores/catalogStore'
import { type FilterParams } from '@/interfaces/CatalogInterfaces'

export function useGetQueryFromRoute() {
  const route = useRoute()
  const catalogStore = useCatalogStore()

  const pageAmount = computed(() => {
    if (catalogStore.config && catalogStore.config.totalPages) {
      return catalogStore.config.totalPages
    }
    return 0
  })

  const getFilter = computed<FilterParams>(() => ({
    colorId: getArray(route.query.colorId as string | string[]),
    sizeId: getArray(route.query.sizeId as string | string[]),
    brandId: getArray(route.query.brandId as string | string[]),
    minPrice:
      typeof route.query.minPrice === 'undefined' ? undefined : Number(route.query.minPrice),
    maxPrice: typeof route.query.maxPrice === 'undefined' ? undefined : Number(route.query.maxPrice)
  }))

  const getSorting = computed(() => ({ sorting: route.query.sorting || '' }))

  const getPage = computed(() => {
    const queryPage = Number(route.query.page)
    const pageObj = { page: queryPage }

    if (pageAmount.value && queryPage > pageAmount.value) {
      pageObj.page = pageAmount.value
    }
    if (queryPage < 1) {
      pageObj.page = 1
    }

    return pageObj
  })

  const getAllCatalogQueries = computed(() => {
    return {
      ...getFilter.value,
      ...getSorting.value,
      ...getPage.value
    } as FilterParams
  })

  function getArray(value: string | string[]): string[] {
    if (Array.isArray(value)) {
      return value
    }
    if (value === null || value === undefined) {
      return []
    }
    return [value.toString()]
  }

  return {
    getFilter,
    getSorting,
    getPage,
    getAllCatalogQueries,
    pageAmount
  }
}
