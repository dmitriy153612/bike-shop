<template>
  <ul class="order-switcher">
    <li class="order-switcher__item" v-for="(item, index) in values" :key="index">
      <switcher-btn
        class="order-switcher__btn"
        :value="item._id"
        :name="name"
        :disabled="!item.available"
        v-model="updatedId"
      >
        <div class="order-switcher__content">
          <span class="order-switcher__svg-box">
            <svg
              v-for="(svgid, i) in svgIds[item.type as keyof typeof svgIds]"
              :key="i"
              class="order-switcher__svg"
            >
              <use :xlink:href="svgid" />
            </svg>
          </span>

          <span class="order-switcher__type">
            {{ item.name }}
            <br />
            <span v-if="!item.available" class="order-switcher__type-disabled">
              Временно недоступно</span
            >
            <span v-if="'deliveryTime' in item" class="order-switcher__time">
              {{ deliveryTime(item) }}</span
            >
          </span>

          <span v-if="'price' in item" class="order-switcher__price">
            {{ formatCurrency(item.price) }}
          </span>
        </div>
      </switcher-btn>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { type DeliveryType, type PaymentType } from '@/interfaces/OrderInterfaces'
import formatCurrency from '@/helpers/formatCurrency'
import SwitcherBtn from '@/components/UI/SwitcherBtn.vue'

const props = defineProps({
  values: { type: Array as () => DeliveryType[] | PaymentType[], required: true },
  modelValue: { type: String, required: true },
  name: { type: String, required: true }
})

const emit = defineEmits(['update:modelValue'])

const updatedId = computed({
  get: () => props.modelValue,
  set: (newValue) => emit('update:modelValue', newValue)
})

const svgIds: { delivery: string[]; pickup: string[]; online: string[] } = {
  delivery: ['#delivery'],
  pickup: ['#pickup'],
  online: ['#visa', '#mastercard']
}

const deliveryTime = (prop: DeliveryType) => {
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

<style lang="scss" scoped>
@import '@/assets/style/config/variables.scss';

.order-switcher {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;

  @media #{$screen-medium} {
    grid-template-columns: 1fr;
  }

  &__btn {
    height: 100%;
  }

  &__content {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 6px;

    @media #{$screen-medium} {
      grid-template-columns: auto 1fr auto;
    }
  }

  &__svg-box {
    display: flex;
    gap: 6px;

    @media #{$screen-small} {
      flex-direction: column;
      gap: 0;
    }
  }

  &__svg {
    justify-self: flex-end;
    height: 40px;
    width: 40px;
    fill: $sunglow;
    transition: fill 0.2s ease;
  }

  &__type {
    align-self: center;
    font-weight: 600;
  }

  &__type-disabled {
    color: $boulder;
  }

  &__time {
    color: $black;
    font-weight: 400;
    font-size: 14px;
  }
}
</style>
