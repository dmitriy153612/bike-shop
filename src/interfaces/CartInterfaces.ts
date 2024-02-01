import { type Brand, type Color, type Size } from './CatalogInterfaces'

export interface CartConfig {
  selectedAmount: number
  totalAmount: number
  totalOldPrice: number
  totalPrice: number
  totalPriceDifference: number
}

export interface CartItem {
  cartItemId: string
  amount: number
}

export interface CartProduct extends CartItem {
  brand: Brand
  color: Color
  discount: number
  oldPrice: number
  picture: string
  price: number
  priceDifference: number
  priceForOne: number
  productId: string
  selected: boolean
  size: Size
  title: string
}

export interface CartResponse {
  config: CartConfig
  products: CartProduct[]
}

export interface SelectedCartItem {
  cartItemId: string
  selected: boolean
}

export interface AddedToCartProduct {
  productId: string
  sizeId: string
  amount: number
}
