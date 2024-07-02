<template>
  <div class="order-placing">
    <app-fieldset
      legend="Способ получения"
      class="order-placing__field order-placing__field--delivery-switcher"
    >
      <order-switcher
        v-model="updatedSelectedDeliveryTypeId"
        :values="deliveryTypesList"
        name="obtaining"
      />
    </app-fieldset>

    <app-fieldset
      legend="Адрес доставки"
      id="order-placing__delivery"
      class="order-placing__field order-placing__field--delivery-address"
      v-if="getDeliveryTypeName === 'delivery'"
    >
      <order-delivery-address
        v-model:deliveryAddress="updatedDeliveryAddress"
        v-model:deliveryAddressErrors="updatedDeliveryAddressErrors"
      />
    </app-fieldset>

    <app-fieldset
      legend="Пункт выдачи"
      id="order-placing__pickup"
      class="order-placing__field order-placing__field--pickup-addresses"
      v-if="getDeliveryTypeName === 'pickup'"
    >
      <order-pickup-addresses
        v-model="updatedSelectedPickupAddressId"
        :pickup-list="pickupPointsList"
      />
    </app-fieldset>

    <app-fieldset legend="Получатель" class="order-placing__field order-placing__field--user">
      <order-user
        id="order-placing__user"
        v-model:userData="updatedUserData"
        v-model:userDataErrors="updatedUserDataErrors"
      />
    </app-fieldset>

    <app-fieldset
      legend="Способ оплаты"
      class="order-placing__field order-placing__field--paymant-switcher"
    >
      <order-switcher
        v-model="updatedSelectedPaymentTypeId"
        :values="paymentTypesList"
        name="payment"
      />
    </app-fieldset>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import {
  type UserContact,
  type UserAddress,
  type DeliveryType,
  type PaymentType,
  type Pickpoint
} from '@/interfaces/OrderInterfaces'
import AppFieldset from '@/components/layouts/AppFieldset.vue'
import OrderSwitcher from '@/components/order/OrderSwitcher.vue'
import OrderDeliveryAddress from '@/components/order/OrderDeliveryAddress.vue'
import OrderPickupAddresses from '@/components/order/OrderPickupAddresses.vue'
import OrderUser from '@/components/order/OrderUser.vue'

const props = defineProps({
  selectedDeliveryTypeId: { type: String, required: true },
  deliveryTypesList: { type: Array as () => DeliveryType[], required: true },
  getDeliveryTypeName: { type: String, required: true },
  deliveryAddress: { type: Object as () => UserAddress, required: true },
  deliveryAddressErrors: { type: Object as () => UserAddress, required: true },
  selectedPickupAddressId: { type: String, required: true },
  pickupPointsList: { type: Array as () => Pickpoint[], required: true },
  userData: { type: Object as () => UserContact, required: true },
  userDataErrors: { type: Object as () => UserContact, required: true },
  selectedPaymentTypeId: { type: String, required: true },
  paymentTypesList: { type: Array as () => PaymentType[], required: true }
})

const emit = defineEmits([
  'update:selectedDeliveryTypeId',
  'update:deliveryAddress',
  'update:deliveryAddressErrors',
  'update:selectedPickupAddressId',
  'update:userData',
  'update:userDataErrors',
  'update:selectedPaymentTypeId'
])

const updatedSelectedDeliveryTypeId = computed({
  get: () => props.selectedDeliveryTypeId,
  set: (newValue) => emit('update:selectedDeliveryTypeId', newValue)
})
const updatedDeliveryAddress = computed({
  get: () => props.deliveryAddress,
  set: (newValue) => emit('update:deliveryAddress', newValue)
})
const updatedDeliveryAddressErrors = computed({
  get: () => props.deliveryAddressErrors,
  set: (newValue) => emit('update:deliveryAddressErrors', newValue)
})
const updatedSelectedPickupAddressId = computed({
  get: () => props.selectedPickupAddressId,
  set: (newValue) => emit('update:selectedPickupAddressId', newValue)
})
const updatedUserData = computed({
  get: () => props.userData,
  set: (newValue) => emit('update:userData', newValue)
})
const updatedUserDataErrors = computed({
  get: () => props.userDataErrors,
  set: (newValue) => emit('update:userDataErrors', newValue)
})
const updatedSelectedPaymentTypeId = computed({
  get: () => props.selectedPaymentTypeId,
  set: (newValue) => emit('update:selectedPaymentTypeId', newValue)
})
</script>

<style lang="scss" scoped>
@import '@/assets/style/config/variables.scss';

.order-placing {
  display: grid;
  grid-template-columns: 1fr auto;

  column-gap: 20px;
  row-gap: 40px;
  padding: 40px 20px 20px;
  margin-bottom: 20px;

  border-radius: 15px;
  box-shadow: 0px 0px 9px 3px rgba(0, 0, 0, 0.32);

  @media #{$screen-medium} {
    grid-template-columns: 1fr;
  }

  &__field {
    &--delivery-switcher {
      grid-column: 1 / 3;

      @media #{$screen-medium} {
        grid-column: 1;
      }
    }

    &--delivery-address {
      grid-column: 1 / 2;

      @media #{$screen-medium} {
        grid-column: 1;
      }
    }

    &--pickup-points {
      grid-column: 1 / 2;

      @media #{$screen-medium} {
        grid-column: 1;
      }
    }

    &--user {
      grid-column: 2 / 3;

      height: max-content;

      @media #{$screen-medium} {
        grid-column: 1;
      }
    }

    &--paymant-switcher {
      grid-column: 1 / 3;

      @media #{$screen-medium} {
        grid-column: 1;
      }
    }
  }
}
</style>
