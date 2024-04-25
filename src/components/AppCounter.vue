<template>
  <div class="counter">
    <button class="counter__btn" aria-label="уменьшить количество товара" @click="decrement">
      <span class="counter__symbol" />
    </button>

    <div
      class="counter__amount-screen"
      role="spinbutton"
      :aria-valuemin="1"
      :aria-valuenow="currentAmount"
      :aria-valuemax="99"
      :aria-label="`количество товара ${currentAmount}`"
    >
      {{ amount }}
    </div>

    <button
      class="counter__btn counter__btn--plus"
      aria-label="увеличить количество товара"
      @click="increment"
    >
      <span class="counter__symbol" />
      <span class="counter__symbol" />
    </button>
    <price-for-one v-if="amount > 1" class="counter__price-for-one" :price-for-one="priceForOne" />
  </div>
</template>

<script lang="ts" setup>
import PriceForOne from '@/components/PriceForOne.vue'
import { ref, watch } from 'vue'

const emit = defineEmits(['amount'])

const props = defineProps({
  amount: { type: Number, required: true },
  priceForOne: { type: Number, required: true }
})

const currentAmount = ref<number>(props.amount)

function increment(): void {
  currentAmount.value += 1
}
function decrement(): void {
  if (currentAmount.value <= 1) {
    return
  }
  currentAmount.value -= 1
}

watch(
  () => currentAmount.value,
  (newValue) => {
    emit('amount', newValue)
  }
)
</script>

<style lang="scss" scoped>
@import '@/assets/style/config/variables.scss';

.counter {
  display: grid;
  grid-template-columns: repeat(3, min-content);
  row-gap: 4px;
  height: min-content;
  align-items: center;

  &__btn {
    position: relative;
    border: 2px solid transparent;
    border-radius: 5px;
    padding: 0;
    height: 28px;
    width: 28px;
    background-color: $black;
    cursor: pointer;
    outline: 2px solid transparent;
    transition: outline 0.2s ease;
  }

  &__btn:focus {
    outline-color: $sunglow;
  }

  @media #{$hover-min-width} {
    &__btn:hover &__symbol {
      background-color: $sunglowLighten;
    }
  }

  &__btn:active &__symbol {
    background-color: red;
  }

  &__btn--plus &__symbol:nth-child(2) {
    transform: translateY(-50%) rotate(90deg);
  }

  &__symbol {
    position: absolute;
    top: 50%;
    right: 10%;
    left: 10%;
    height: 3px;
    background-color: $sunglow;
    transform: translateY(-50%);
    transition: background-color 0.2s ease;
  }

  &__amount-screen {
    display: flex;
    justify-content: center;
    padding: 0 4px;
    min-width: 35px;
    font-size: 24px;
  }

  &__price-for-one {
    grid-column: 1 / 4;
    justify-content: center;
  }
}
</style>
