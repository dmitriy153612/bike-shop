<template>
  <order-fieldset class="order-delivery" legend="Адрес доставки">
    <app-input
      v-model="updatedDeliveryAddres['city']"
      class="order-delivery__input-city"
      label="Город"
      :required="true"
      :disabled="true"
      :error="updateddeliveryAddressErrors['city']"
      @remove-error="updateddeliveryAddressErrors['city'] = ''"
    />
    <app-input
      v-model="updatedDeliveryAddres['street']"
      class="order-delivery__input-street"
      label="Улица"
      :required="true"
      :error="updateddeliveryAddressErrors['street']"
      @remove-error="updateddeliveryAddressErrors['street'] = ''"
    />
    <app-input
      v-model="updatedDeliveryAddres['house']"
      class="order-delivery__input-house"
      label="Дом"
      :required="true"
      :error="updateddeliveryAddressErrors['house']"
      @remove-error="updateddeliveryAddressErrors['house'] = ''"
    />
    <app-input
      v-model="updatedDeliveryAddres['building']"
      class="order-delivery__input-building"
      label="Кор."
      :error="updateddeliveryAddressErrors['building']"
      @remove-error="updateddeliveryAddressErrors['building'] = ''"
    />
    <app-input
      v-model="updatedDeliveryAddres['appartment']"
      class="order-delivery__input-appartment"
      label="Кв."
      :error="updateddeliveryAddressErrors['appartment']"
      @remove-error="updateddeliveryAddressErrors['appartment'] = ''"
    />
  </order-fieldset>
</template>

<script lang="ts" setup>
import { type PropType, computed } from 'vue'
import AppInput from '@/components/UI/AppInput.vue'
import OrderFieldset from '@/components/OrderFieldset.vue'
import { type UserAddress } from '@/interfaces/OrderInterfaces'

const emit = defineEmits(['update:deliveryAddress', 'update:deliveryAddressErrors'])

const props = defineProps({
  deliveryAddress: { type: Object as PropType<UserAddress>, required: true },
  deliveryAddressErrors: { type: Object as PropType<UserAddress>, required: true }
})

const updatedDeliveryAddres = computed({
  get: () => props.deliveryAddress,
  set: (newValue) => {
    emit('update:deliveryAddress', newValue)
  }
})
const updateddeliveryAddressErrors = computed({
  get: () => props.deliveryAddressErrors,
  set: (newValue) => {
    emit('update:deliveryAddressErrors', newValue)
  }
})
</script>
@/interfaces/OrderInterfaces
