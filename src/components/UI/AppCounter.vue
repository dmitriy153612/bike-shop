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
    <app-price-for-one
      v-if="amount > 1"
      class="counter__price-for-one"
      :price-for-one="priceForOne"
    />
  </div>
</template>

<script lang="ts" setup>
import AppPriceForOne from '@/components/common/AppPriceForOne.vue'
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
