import { type Brand, type Color, type Size } from './CatalogInterfaces'

export interface CreatingOrder {
  delivery: DeliveryPickup | DeliveryAddress
  deliveryListIds: string[]
  paymentTypeId: string
  userData: {
    name: string
    phone: string
    surname: string
  }
}

export interface OrderConfig {
  deliveryName: string
  deliveryPrice: number
  deliveryTypeId: string
  paymentName: string
  paymentTypeId: string
  selectedAmount: number
  totalAmount: number
  totalOldPrice: number
  totalPrice: number
  totalPriceDifference: number
}

export interface OrderProduct {
  amount: number
  brand: Brand
  cartItemId: string
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

export interface DeliveryAddress {
  deliveryTypeId: string
  address: UserAddress
}

export interface DeliveryPickup {
  deliveryTypeId: string
  pickupAddressId: string
}

export interface OrderConfigQuery {
  deliveryTypeId: string
  paymentTypeId: string
}

export interface UserAddress {
  city: string
  street: string
  house: string
  building?: string
  appartment?: string
}

export interface DeliveryType {
  _id: string
  available: boolean
  deliveryTime: number
  name: string
  price: number
  type: string
}

export interface PaymentType {
  _id: string
  available: boolean
  name: string
  type: string
}

export interface Pickpoint {
  _id: string
  address: string
  lineColor: string
  metro: string
  workTime: {
    _id: string
    day: string
    time: string
  }[]
}

export interface UserContact {
  name: string
  surname: string
  phone: string
}
