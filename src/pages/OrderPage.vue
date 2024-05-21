<template>
  <page-structure :title="mainTitle" :breadcrumbs="breadcrumbs">
    <div class="order-page">
      <section class="order-page__sec">
        <app-container class="order-page__container">
          <template v-if="!orderListProducts.length && !orderStore.isGetOrderLoading">
            <p class="order-page__message-text">Товары для заказа не выбраны.</p>
          </template>

          <template v-if="orderStore.completeOrderNumber">
            <p class="order-page__message-text">
              Заказ
              <strong>№{{ orderStore.completeOrderNumber }}</strong>
              успешно создан!
              <br />
              В течение часа наш оператор свяжется с Вами для подтверждения заказа.
            </p>
          </template>

          <template v-if="!orderStore.completeOrderNumber && orderListProducts.length">
            <order-placing
              v-model:selected-delivery-type-id="selectedDeliveryTypeId"
              :delivery-types-list="deliveryTypesList"
              :get-delivery-type-name="getDeliveryTypeName"
              v-model:delivery-address="deliveryAddress"
              v-model:delivery-address-errors="deliveryAddressErrors"
              v-model:selected-pickup-address-id="selectedPickupAddressId"
              :pickup-points-list="pickupPointsList"
              v-model:user-data="userData"
              v-model:user-data-errors="userDataErrors"
              v-model:selected-payment-type-id="selectedPaymentTypeId"
              :payment-types-list="paymentTypesList"
            />

            <div class="order-page__right">
              <cart-order-form
                :show-delivery="true"
                :amount="orderStore.orderConfig.selectedAmount"
                :price-difference="orderStore.orderConfig.totalPriceDifference"
                :delivery-price="orderStore.orderConfig.deliveryPrice"
                :old-price="orderStore.orderConfig.totalOldPrice"
                :price="orderStore.orderConfig.totalPrice"
                :show-spinner="submitFormSpinner"
              >
                <button-submit btn-name="Заказать" @click.prevent="createOrder" />
              </cart-order-form>
            </div>

            <order-list class="order-page__list" :order-list="orderListProducts" />
          </template>
        </app-container>
      </section>
    </div>
  </page-structure>
</template>

<script lang="ts" setup>
import { ref, watch, computed, watchEffect, reactive, type Ref } from 'vue'
import PageStructure from '@/components/layouts/PageStructure.vue'
import AppContainer from '@/components/layouts/AppContainer.vue'
import CartOrderForm from '@/components/cart/CartOrderForm.vue'
import ButtonSubmit from '@/components/UI/ButtonSubmit.vue'
import OrderList from '@/components/order/OrderList.vue'
import OrderPlacing from '@/components/order/OrderPlacing.vue'
import { onBeforeRouteLeave } from 'vue-router'
import { useOrderStore } from '@/stores/orderStore'
import { useCartStore } from '@/stores/cartStore'
import {
  type UserContact,
  type UserAddress,
  type DeliveryType,
  type PaymentType,
  type Pickpoint,
  type OrderProduct,
  type CreatingOrder,
  type DeliveryAddress,
  type DeliveryPickup
} from '@/interfaces/OrderInterfaces'

const breadcrumbs = ref([
  {
    linkName: 'Каталог',
    pageName: 'catalog'
  },
  {
    linkName: 'Корзина',
    pageName: 'cart'
  },
  {
    linkName: 'Оформление заказа',
    pageName: 'order'
  }
])

const orderStore = useOrderStore()
const cartStore = useCartStore()

const selectedDeliveryTypeId = ref<string>('')
const selectedPaymentTypeId = ref<string>('')
const selectedPickupAddressId = ref<string>('')

const userData = ref<UserContact>({
  name: '',
  surname: '',
  phone: ''
})
const deliveryAddress = ref<UserAddress>({
  city: 'Москва',
  street: '',
  house: '',
  building: '',
  appartment: ''
})
const userDataErrors = ref<UserContact>({
  name: '',
  surname: '',
  phone: ''
})
const deliveryAddressErrors = ref<UserAddress>({
  city: '',
  street: '',
  house: '',
  building: '',
  appartment: ''
})

const deliveryTypesList = computed<DeliveryType[]>(() => orderStore.deliveryTypesList)
const paymentTypesList = computed<PaymentType[]>(() => orderStore.paymentTypesList)
const pickupPointsList = computed<Pickpoint[]>(() => orderStore.pickupPointsList)
const orderListProducts = computed<OrderProduct[]>(() => orderStore.orderList)

const submitFormSpinner = computed<boolean>(() => {
  return orderStore.isGetOrderConfigLoading
})

const getDeliveryTypeName = computed<string>(() => {
  const deliveryObj = deliveryTypesList.value.find(
    (obj) => obj._id === selectedDeliveryTypeId.value
  )
  if (deliveryObj) {
    return deliveryObj.type
  } else {
    return ''
  }
})

const mainTitle = computed<string>(() => {
  if (!orderStore.completeOrderNumber) {
    return 'Оформление заказа'
  }
  return `Заказ №${orderStore.completeOrderNumber} оформлен`
})

orderStore.fetchGetDeliveryTypes()
orderStore.fetchGetPaymentTypes()
orderStore.fetchGetOrder()

function validateUserData(): boolean {
  const shortName = 'Не может быть короче 2 букв'
  const emptyName = 'Не может быть пустым'
  const formatName = (str: string) => {
    if (!str.length) {
      return ''
    }
    return str
      .trim()
      .replace(/ +/g, ' ')
      .split(' ')
      .map((name) => {
        return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
      })
      .join(' ')
  }
  const validateName = (value: string, objErrName: keyof UserContact) => {
    if (!value) {
      userDataErrors.value[objErrName] = emptyName
    } else if (value.length < 2) {
      userDataErrors.value[objErrName] = shortName
    }
  }
  const numericPhone: string = userData.value.phone.replace(/\D/g, '')

  userData.value.name = formatName(userData.value.name)
  userData.value.surname = formatName(userData.value.surname)

  validateName(userData.value.name, 'name')
  validateName(userData.value.surname, 'surname')

  if (!numericPhone) {
    userDataErrors.value.phone = emptyName
  } else if (numericPhone.length < 11) {
    userDataErrors.value.phone = 'Не может быть короче 11-ти цифр'
  }

  return !Object.values(userDataErrors.value).some((value) => value !== '')
}

function validateDeliveryAddress() {
  const requiredFields = ['city', 'street', 'house']
  const emptyField = 'Не может быть пустым'

  for (let key in deliveryAddress.value) {
    const fieldValue = deliveryAddress.value[key as keyof UserAddress]
    if (!fieldValue && !fieldValue?.length && requiredFields.includes(key)) {
      deliveryAddressErrors.value[key as keyof UserAddress] = emptyField
    }
  }
  return !Object.values(deliveryAddressErrors.value).some((value) => value !== '')
}

function setFirstAvailableOption(optionsList: any[], selectedOptionId: Ref<string>) {
  if (optionsList.length) {
    const availableOptionObj = optionsList.find(
      (option: { available: boolean }) => option.available === true
    )
    if (availableOptionObj) {
      selectedOptionId.value = availableOptionObj._id
    }
  }
}

function setFirstPickupPointId(
  pickupPointsList: string | any[],
  selectedPickupAddressId: Ref<string>
) {
  if (pickupPointsList.length) {
    selectedPickupAddressId.value = pickupPointsList[0]._id
  }
}

function scrollToBlock(targetElem: HTMLElement | null) {
  if (targetElem) {
    targetElem.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

async function createOrder() {
  if (submitFormSpinner.value) {
    return
  }
  const isUserDataValid = validateUserData()
  const orderData = reactive<CreatingOrder>({
    delivery: {} as DeliveryAddress | DeliveryPickup,
    paymentTypeId: '',
    deliveryListIds: [],
    userData: {
      name: '',
      phone: '',
      surname: ''
    }
  })

  if (getDeliveryTypeName.value === 'delivery') {
    const isDeliveryAddressValid = validateDeliveryAddress()
    if (!isDeliveryAddressValid) {
      const deliveryBlock = document.getElementById('order-placing__delivery')
      scrollToBlock(deliveryBlock)
      return
    }
    orderData.delivery = {
      deliveryTypeId: selectedDeliveryTypeId.value,
      address: deliveryAddress.value
    }
  } else if (getDeliveryTypeName.value === 'pickup') {
    if (!selectedPickupAddressId.value) {
      const pickupBlock = document.getElementById('order-placing__pickup')
      scrollToBlock(pickupBlock)
      return
    }
    orderData.delivery = {
      deliveryTypeId: selectedDeliveryTypeId.value,
      pickupAddressId: selectedPickupAddressId.value
    }
  }

  if (!isUserDataValid) {
    const userBlock = document.getElementById('order-placing__user')
    scrollToBlock(userBlock)
    return
  }

  orderData.userData = userData.value
  orderData.paymentTypeId = selectedPaymentTypeId.value
  orderData.deliveryListIds = orderListProducts.value.map((product) => product.cartItemId)

  await orderStore.fetchCreateOrder(orderData)

  if (orderStore.completeOrderNumber) {
    cartStore.fetchGetCart()
  }
}

onBeforeRouteLeave((_, __, next) => {
  orderStore.removeCompleteOrderNumber()
  next()
})

watch(
  () => deliveryTypesList.value,
  (newValue) => {
    setFirstAvailableOption(newValue, selectedDeliveryTypeId)
  }
)
watch(
  () => paymentTypesList.value,
  (newValue) => {
    setFirstAvailableOption(newValue, selectedPaymentTypeId)
  }
)
watch(
  () => pickupPointsList.value,
  (newValue) => {
    setFirstPickupPointId(newValue, selectedPickupAddressId)
  }
)

watchEffect(() => {
  if (selectedDeliveryTypeId.value && selectedPaymentTypeId.value) {
    orderStore.fetchGetOrderConfig({
      deliveryTypeId: selectedDeliveryTypeId.value,
      paymentTypeId: selectedPaymentTypeId.value
    })
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/style/config/variables.scss';

.order-page {
  &__container {
    display: grid;
    grid-template-columns: 1fr auto;
    column-gap: 20px;

    @media #{$screen-huge} {
      grid-template-columns: 1fr;
    }
  }

  &__title {
    grid-column: 1 / 3;

    @media #{$screen-huge} {
      grid-column: 1;
    }
  }

  &__right {
    position: sticky;
    top: 120px;
    align-self: flex-start;

    @media #{$screen-huge} {
      grid-row: 4;
      justify-self: center;
    }
  }

  &__list {
    @media #{$screen-huge} {
      margin-bottom: 20px;
    }
  }

  &__message-text {
    margin: 0;
    font-size: 22px;
  }
}
</style>
