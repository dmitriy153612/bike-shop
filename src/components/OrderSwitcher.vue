<template>
  <order-fieldset class="order-switcher" :legend="legend">
    <ul class="order-switcher__list">
      <li
        v-for="(prop, index) in propertyList"
        :key="index"
        class="order-radio order-switcher__item"
      >
        <span v-if="!prop.available" class="order-switcher__disabled" />
        <input
          :id="`order-switcher${prop._id + index}`"
          v-model="updatedModelValue"
          class="order-radio__input order-switcher__input"
          type="radio"
          :disabled="!prop.available"
          :name="name"
          :value="prop._id"
        />
        <label
          :for="`order-switcher${prop._id + index}`"
          class="order-radio__label order-switcher__label"
          :class="{ selected: modelValue === prop._id }"
        >
          <span class="order-switcher__svg-box">
            <svg
              v-for="(svgid, i) in svgIds[prop.type as keyof typeof svgIds]"
              :key="i"
              class="order-switcher__svg"
            >
              <use :xlink:href="svgid" />
            </svg>
          </span>

          <span class="order-switcher__type">
            {{ prop.name }}
            <br />
            <span v-if="!prop.available" class="order-switcher__type-disabled"
              >Временно недоступно</span
            >
            <span v-if="'deliveryTime' in prop" class="order-switcher__time">
              {{ deliverTime(prop) }}</span
            >
          </span>

          <span v-if="'price' in prop" class="order-switcher__price">
            {{ formatCurrency(prop.price) }}
          </span>
        </label>
      </li>
    </ul>
  </order-fieldset>
</template>

<script lang="ts" setup>
import OrderFieldset from '@/components/OrderFieldset.vue'
import formatCurrency from '@/helpers/formatCurrency'
import { type PropType, computed } from 'vue'
import { type DeliveryType, type PaymentType } from '@/interfaces/OrderInterfaces'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  propertyList: { type: Array as PropType<DeliveryType[] | PaymentType[]>, required: true },
  modelValue: { type: String, required: true },
  legend: { type: String, required: true },
  name: { type: String, required: true }
})

const svgIds: { delivery: string[]; pickup: string[]; online: string[] } = {
  delivery: ['#delivery'],
  pickup: ['#pickup'],
  online: ['#visa', '#mastercard']
}

const updatedModelValue = computed({
  get: () => props.modelValue,
  set: (newValue) => emit('update:modelValue', newValue)
})

const deliverTime = (prop: DeliveryType) => {
  const daysAmount = prop.deliveryTime / 24
  let from = '1-'
  let wordDay = ''
  if (daysAmount === 1) {
    wordDay = 'день'
    from = ''
  } else if (daysAmount >= 2 && daysAmount <= 4) {
    wordDay = 'дня'
  }

  return `${from}${daysAmount} ${wordDay}`
}
</script>
@/interfaces/OrderInterfaces
