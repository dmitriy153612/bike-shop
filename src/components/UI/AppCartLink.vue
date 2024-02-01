<template>
  <router-link :aria-label="ariaLabel" class="cart-link" :to="{ name: 'cart' }">
    <svg class="cart-link__svg">
      <use xlink:href="#cart2" />
    </svg>
    <span class="cart-link__counter">{{ amount }}</span>
  </router-link>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps({
  amount: { type: Number, default: 0 }
})
const ariaLabel = computed<string>(() => `Перейти в корзину. Товаров в корзине ${props.amount}`)
</script>
