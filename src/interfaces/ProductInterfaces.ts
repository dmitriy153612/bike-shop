import { type Product } from '@/interfaces/CatalogInterfaces'

export interface ProductDetail extends Product {
  info: ProductInfo[]
}

export interface ProductInfo {
  _id: string
  infoGroupName: string
  infoList: Array<{ _id: string; name: string; property: string }>
}
