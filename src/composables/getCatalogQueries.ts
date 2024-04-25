import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { type FilterParams } from '@/interfaces/CatalogInterfaces'

export function useGetQueryFromRoute() {
  const route = useRoute()

  function getArray(value: string | string[]): string[] {
    if (Array.isArray(value)) {
      return value
    }
    if (value === null || value === undefined) {
      return []
    }
    return [value.toString()]
  }

  const getFilter = computed<FilterParams>(() => ({
    colorId: getArray(route.query.colorId as string | string[]),
    sizeId: getArray(route.query.sizeId as string | string[]),
    brandId: getArray(route.query.brandId as string | string[]),
    minPrice:
      typeof route.query.minPrice === 'undefined' ? undefined : Number(route.query.minPrice),
    maxPrice: typeof route.query.maxPrice === 'undefined' ? undefined : Number(route.query.maxPrice)
  }))

  const getSorting = computed(() => ({ sorting: route.query.sorting || '' }))
  const getPage = computed(() => ({ page: route.query.page }))

  const getAllCatalogQueries = computed(
    () =>
      ({
        ...getFilter.value,
        ...getSorting.value,
        ...getPage.value
      }) as FilterParams
  )

  return {
    getFilter,
    getSorting,
    getPage,
    getAllCatalogQueries
  }
}
