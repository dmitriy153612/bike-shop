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

<style lang="scss" scoped>
@import '@/assets/style/config/variables.scss';

.cart-link {
  position: relative;
  display: flex;
  align-items: flex-end;
  border: 1px solid transparent;
  margin: 0;
  padding-right: 3px;
  max-height: 100%;
  background-color: transparent;
  color: $sunglow;
  outline: none;
  text-decoration: none;
  transition-property: border-color color;
  transition-duration: 0.2s;
  transition-timing-function: ease;

  &:focus {
    border-color: $sunglow;
  }

  @media #{$hover-min-width} {
    &:hover {
      color: $sunglowLighten;
    }

    &:hover &__svg {
      stroke: $sunglowLighten;
    }
  }

  &:active {
    color: $grenadier;
  }

  &:active &__svg {
    stroke: $grenadier;
  }

  cursor: pointer;

  &__svg {
    display: block;
    stroke: $sunglow;
    fill: transparent;
    width: 30px;
    height: 30px;
    transition: stroke 0.2s ease;
  }

  &__counter {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1px 3px;
    border-radius: 10px;
    font-size: 12px;
    line-height: 1;
    color: $white;
    background-color: $grenadier;
  }
}
</style>
