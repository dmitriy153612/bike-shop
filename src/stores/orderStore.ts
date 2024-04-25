import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios, { type AxiosResponse } from 'axios'
import {
  BASE_API_URL,
  ORDER_GET_ORDER_PATH,
  ORDER_GET_ORDER_CONFIG_PATH,
  ORDER_DELIVERY_TYPES_PATH,
  ORDER_PAYMENT_TYPES_PATH,
  ORDER_GET_PICKUP_POINTS_PATH,
  ORDER_CREATE_ORDER_PATH
} from '@/config'
import { useLoginStore } from '@/stores/loginStore'
import { useGlobalStore } from '@/stores/globalStore'
import {
  type OrderProduct,
  type DeliveryType,
  type PaymentType,
  type Pickpoint,
  type OrderConfigQuery,
  type OrderConfig,
  type CreatingOrder
} from '@/interfaces/OrderInterfaces'

export const useOrderStore = defineStore('orderStore', () => {
  const loginStore = useLoginStore()
  const globalStore = useGlobalStore()

  const orderList = ref<OrderProduct[]>([])
  const deliveryTypesList = ref<DeliveryType[]>([])
  const paymentTypesList = ref<PaymentType[]>([])
  const pickupPointsList = ref<Pickpoint[]>([])
  const completeOrderNumber = ref<string>('')

  const orderConfig = ref<OrderConfig>({
    deliveryName: '',
    deliveryPrice: 0,
    deliveryTypeId: '',
    paymentName: '',
    paymentTypeId: '',
    selectedAmount: 0,
    totalAmount: 0,
    totalOldPrice: 0,
    totalPrice: 0,
    totalPriceDifference: 0
  })

  const isGetOrderLoading = ref<boolean>(false)
  const isGetOrderConfigLoading = ref<boolean>(false)
  const isGetDeliveryTypesLoading = ref<boolean>(false)
  const isGetPaymentTypesLoading = ref<boolean>(false)
  const isGetPickupPointsLoading = ref<boolean>(false)
  const isCreateOrderLoading = ref<boolean>(false)

  function removeCompleteOrderNumber(): void {
    completeOrderNumber.value = ''
  }

  async function fetchGetOrder(): Promise<void> {
    if (!loginStore.token) {
      return
    }
    try {
      globalStore.showSpinner(true)
      isGetOrderLoading.value = true

      const res: AxiosResponse<{ products: OrderProduct[] }> = await axios.get(
        `${BASE_API_URL}${ORDER_GET_ORDER_PATH}`,
        {
          headers: {
            Authorization: `Bearer ${loginStore.token}`
          }
        }
      )
      orderList.value = res.data.products
    } catch (err) {
      console.error(err)
    } finally {
      isGetOrderLoading.value = false
      globalStore.showSpinner(false)
    }
  }

  async function fetchGetOrderConfig({
    deliveryTypeId,
    paymentTypeId
  }: OrderConfigQuery): Promise<void> {
    if (!loginStore.token) {
      return
    }
    try {
      isGetOrderConfigLoading.value = true

      const res: AxiosResponse<{ config: OrderConfig }> = await axios.post(
        `${BASE_API_URL}${ORDER_GET_ORDER_CONFIG_PATH}`,
        { deliveryTypeId, paymentTypeId },
        {
          headers: {
            Authorization: `Bearer ${loginStore.token}`
          }
        }
      )
      orderConfig.value = res.data.config
    } catch (err) {
      console.error(err)
    } finally {
      isGetOrderConfigLoading.value = false
    }
  }

  async function fetchGetDeliveryTypes(): Promise<void> {
    try {
      isGetDeliveryTypesLoading.value = true
      const res: AxiosResponse<DeliveryType[]> = await axios.get(
        `${BASE_API_URL}${ORDER_DELIVERY_TYPES_PATH}`
      )

      deliveryTypesList.value = res.data
    } catch (err) {
      console.error(err)
    } finally {
      isGetDeliveryTypesLoading.value = false
    }
  }

  async function fetchGetPaymentTypes(): Promise<void> {
    try {
      isGetPaymentTypesLoading.value = true

      const res: AxiosResponse<PaymentType[]> = await axios.get(
        `${BASE_API_URL}${ORDER_PAYMENT_TYPES_PATH}`
      )
      paymentTypesList.value = res.data
    } catch (err) {
      console.error(err)
    } finally {
      isGetPaymentTypesLoading.value = false
    }
  }

  async function fetchGetPickupPoints(): Promise<void> {
    try {
      isGetPickupPointsLoading.value = true
      const res: AxiosResponse<Pickpoint[]> = await axios.get(
        `${BASE_API_URL}${ORDER_GET_PICKUP_POINTS_PATH}`
      )
      pickupPointsList.value = res.data
    } catch (err) {
      console.error(err)
    } finally {
      isGetPickupPointsLoading.value = false
    }
  }

  async function fetchCreateOrder(order: CreatingOrder): Promise<void> {
    try {
      isCreateOrderLoading.value = true
      const res: AxiosResponse<{ orderNumber: string }> = await axios.post(
        `${BASE_API_URL}${ORDER_CREATE_ORDER_PATH}`,
        { order },
        {
          headers: {
            Authorization: `Bearer ${loginStore.token}`
          }
        }
      )
      completeOrderNumber.value = res.data.orderNumber
    } catch (err) {
      console.error(err)
    } finally {
      isCreateOrderLoading.value = false
    }
  }

  return {
    orderList,
    orderConfig,
    deliveryTypesList,
    paymentTypesList,
    pickupPointsList,
    completeOrderNumber,

    isGetOrderLoading,
    isGetOrderConfigLoading,
    isGetDeliveryTypesLoading,
    isGetPaymentTypesLoading,
    isGetPickupPointsLoading,
    isCreateOrderLoading,

    fetchGetOrder,
    fetchGetOrderConfig,
    fetchGetDeliveryTypes,
    fetchGetPaymentTypes,
    fetchGetPickupPoints,
    fetchCreateOrder,
    removeCompleteOrderNumber
  }
})
