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
    const pageObj = { page: 1 }
    const queryPage = route.query.page
    if (queryPage && typeof queryPage === 'number') {
      if (queryPage < 1) {
        pageObj.page = 1
      } else if (queryPage > pageAmount.value) {
        pageObj.page = pageAmount.value
      }
    }

    return pageObj
  })

  const getAllCatalogQueries = computed(
    () =>
      ({
        ...getFilter.value,
        ...getSorting.value,
        ...getPage.value
      }) as FilterParams
  )

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
