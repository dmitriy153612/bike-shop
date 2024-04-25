import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios, { type AxiosResponse } from 'axios'
import {
  BASE_API_URL,
  CART_PATH,
  CART_ADD_PATH,
  CART_CHANGE_AMOUNT_PATH,
  CART_DELETE_PATH,
  CART_SELECT_CART_PRODUCT_PATH
} from '@/config'
import { useLoginStore } from '@/stores/loginStore'
import { useGlobalStore } from '@/stores/globalStore'
import {
  type CartItem,
  type AddedToCartProduct,
  type CartConfig,
  type CartProduct,
  type CartResponse
} from '@/interfaces/CartInterfaces'

export const useCartStore = defineStore('cartStore', () => {
  const loginStore = useLoginStore()
  const globalStore = useGlobalStore()

  const isCartAmountLoading = ref<boolean>(false)
  const isGetCartLoading = ref<boolean>(false)
  const isCartRemoveLoading = ref<boolean>(false)
  const isAddtoCartLoading = ref<boolean>(false)
  const isSelectCartProductLoading = ref<number>(0)
  const isSelectedCartItemAmountChanging = ref<number>(0)
  const isCartItemAmountChanging = ref<number>(0)

  const cartAmount = ref<number>(0)
  const cartList = ref<CartProduct[]>([])

  const cartConfig = ref<CartConfig | null>(null)

  function updateIsSelectedCartItemAmountChanging(value: number): void {
    isSelectedCartItemAmountChanging.value += value
  }
  function updateIsCartItemAmountChanging(value: number): void {
    isCartItemAmountChanging.value += value
  }

  function clearCartData(): void {
    cartConfig.value = null
    cartList.value = []
    cartAmount.value = 0
  }

  function setCartAmount(amount: number): void {
    cartAmount.value = amount
  }

  function removeCartItems(cartItemsIds: string[]): void {
    for (let i = cartList.value.length - 1; i >= 0; i--) {
      const cartProduct: CartProduct | undefined = cartList.value[i]
      if (cartProduct && cartItemsIds.includes(cartProduct.cartItemId)) {
        cartList.value.splice(i, 1)
      }
    }
  }

  function updateCartItemAmount(cartItemId: string, amount: number): void {
    const changingItem = cartList.value.find((item: CartProduct) => item.cartItemId === cartItemId)
    if (changingItem) {
      changingItem.amount = amount
    }
  }

  async function fetchAddToCart({ productId, sizeId, amount }: AddedToCartProduct): Promise<void> {
    try {
      if (!loginStore.token) {
        globalStore.openLoginModal(true)
        throw new Error('No access')
      }
      isAddtoCartLoading.value = true
      const res: AxiosResponse<{ totalCartAmount: number }> = await axios.post(
        `${BASE_API_URL}${CART_ADD_PATH}`,
        { productId, sizeId, amount },
        {
          headers: {
            Authorization: `Bearer ${loginStore.token}`
          }
        }
      )
      cartAmount.value = res.data.totalCartAmount
    } catch (err) {
      console.error(err)
    } finally {
      isAddtoCartLoading.value = false
    }
  }

  async function fetchGetCart(): Promise<void> {
    try {
      if (!loginStore.token) {
        throw new Error('No access')
      }
      isGetCartLoading.value = true
      globalStore.showSpinner(true)
      const res: AxiosResponse<CartResponse> = await axios.get(`${BASE_API_URL}${CART_PATH}`, {
        headers: {
          Authorization: `Bearer ${loginStore.token}`
        }
      })
      if (res.data.products) {
        cartList.value = res.data.products
        cartAmount.value = res.data.config.totalAmount
        cartConfig.value = res.data.config
      } else {
        cartList.value = []
        cartAmount.value = 0
        cartConfig.value = null
      }
    } catch (err) {
      console.error(err)
    } finally {
      isGetCartLoading.value = false
      globalStore.showSpinner(false)
    }
  }

  async function fetchChangeCartItemAmount(): Promise<void> {
    try {
      if (!loginStore.token) {
        throw new Error('No access')
      }

      const cartItems: CartItem[] = cartList.value.map((item: CartProduct) => {
        return { cartItemId: item.cartItemId, amount: item.amount }
      })

      const res: AxiosResponse<CartResponse> = await axios.put(
        `${BASE_API_URL}${CART_CHANGE_AMOUNT_PATH}`,
        { cartItems },
        {
          headers: {
            Authorization: `Bearer ${loginStore.token}`
          }
        }
      )
      if (isCartItemAmountChanging.value === 1) {
        cartList.value = res.data.products
        cartAmount.value = res.data.config.totalAmount
        cartConfig.value = res.data.config
      }
    } catch (err) {
      console.error(err)
    }
  }

  async function fetchRemoveCart(cartItemIds: string[]): Promise<void> {
    try {
      if (!loginStore.token) {
        throw new Error('No access')
      }
      isCartRemoveLoading.value = true
      const res: AxiosResponse<CartResponse> = await axios.delete(
        `${BASE_API_URL}${CART_DELETE_PATH}`,
        {
          data: { cartItemIds },
          headers: {
            Authorization: `Bearer ${loginStore.token}`
          }
        }
      )
      cartList.value = res.data.products
      cartAmount.value = res.data.config.totalAmount
      cartConfig.value = res.data.config
    } catch (err) {
      console.error(err)
    } finally {
      isCartRemoveLoading.value = false
    }
  }

  async function fetchSelectCartProducts(cartItemIds: string[]) {
    try {
      if (!loginStore.token) {
        throw new Error('No access')
      }

      isSelectCartProductLoading.value++

      const res: AxiosResponse<CartResponse> = await axios.put(
        `${BASE_API_URL}${CART_SELECT_CART_PRODUCT_PATH}`,
        { cartItemIds },
        {
          headers: {
            Authorization: `Bearer ${loginStore.token}`
          }
        }
      )

      if (res.data.products) {
        cartList.value = res.data.products
        cartAmount.value = res.data.config.totalAmount
        cartConfig.value = res.data.config
      }
    } catch (err) {
      console.error(err)
    } finally {
      isSelectCartProductLoading.value--
    }
  }

  return {
    isCartAmountLoading,
    isGetCartLoading,
    isCartRemoveLoading,
    isSelectCartProductLoading,
    isSelectedCartItemAmountChanging,
    isCartItemAmountChanging,
    isAddtoCartLoading,

    cartList,
    cartConfig,
    cartAmount,

    fetchRemoveCart,
    fetchAddToCart,
    fetchGetCart,
    fetchChangeCartItemAmount,
    fetchSelectCartProducts,
    clearCartData,
    setCartAmount,
    updateCartItemAmount,
    updateIsSelectedCartItemAmountChanging,
    updateIsCartItemAmountChanging,
    removeCartItems
  }
})
