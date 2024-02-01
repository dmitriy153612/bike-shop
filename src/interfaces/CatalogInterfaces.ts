export interface FilterParams {
  brandId: string | string[]
  colorId: string | string[]
  sizeId: string | string[]
  sorting?: string
  page?: number | string
  maxPrice?: number | string | undefined
  minPrice?: number | string | undefined
  limit?: number | string
}

export interface Size {
  _id: string
  name: string
  nameEn: string
}

export interface Brand extends Size {}

export interface Color extends Size {
  code: string
}

export interface CatalogConfig {
  limit: number
  page: number
  totalPages: number
  totalProducts: number
  _id: string
}

export interface Product {
  _id: string
  brand: Brand
  color: Color
  pictures: string[]
  price: number
  oldPrice?: number
  discount?: number
  sizes: Size[]
  title: string
}

export interface CatalogResponse {
  config: CatalogConfig
  catalog: Product[]
}

export interface SortingItem {
  id: string
  label: string
}
