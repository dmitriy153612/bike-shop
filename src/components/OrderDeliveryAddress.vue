<template>
  <ul class="order-delivery">
    <li class="order-delivery__item order-delivery__item--city">
      <app-input
        v-model="updatedDeliveryAddres['city']"
        label="Город"
        :required="true"
        :disabled="true"
        :error="updateddeliveryAddressErrors['city']"
        @remove-error="updateddeliveryAddressErrors['city'] = ''"
      />
    </li>
    <li class="order-delivery__item order-delivery__item--street">
      <app-input
        v-model="updatedDeliveryAddres['street']"
        label="Улица"
        :required="true"
        :error="updateddeliveryAddressErrors['street']"
        @remove-error="updateddeliveryAddressErrors['street'] = ''"
      />
    </li>
    <li class="order-delivery__item order-delivery__item--house">
      <app-input
        v-model="updatedDeliveryAddres['house']"
        label="Дом"
        :required="true"
        :error="updateddeliveryAddressErrors['house']"
        @remove-error="updateddeliveryAddressErrors['house'] = ''"
      />
    </li>
    <li class="order-delivery__item order-delivery__item--building">
      <app-input
        v-model="updatedDeliveryAddres['building']"
        label="Кор."
        :error="updateddeliveryAddressErrors['building']"
        @remove-error="updateddeliveryAddressErrors['building'] = ''"
      />
    </li>
    <li class="order-delivery__item order-delivery__item--appartment">
      <app-input
        v-model="updatedDeliveryAddres['appartment']"
        label="Кв."
        :error="updateddeliveryAddressErrors['appartment']"
        @remove-error="updateddeliveryAddressErrors['appartment'] = ''"
      />
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { type PropType, computed } from 'vue'
import AppInput from '@/components/AppInput.vue'
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

<style lang="scss" scoped>
@import '@/assets/style/config/variables.scss';

.order-delivery {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 18px;

  grid-template-areas:
    'city city city'
    'street street street'
    'house building appartment';

  &__item {
    &--city {
      grid-area: city;
    }
    &--street {
      grid-area: street;
    }
    &--house {
      grid-area: house;
    }
    &--building {
      grid-area: building;
    }
    &--appartment {
      grid-area: appartment;
    }
  }
}
</style>
