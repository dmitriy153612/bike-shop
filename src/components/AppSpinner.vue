<template>
  <div :class="typeClass" class="spinner-overlay">
    <div class="spinner-overlay__spinner-wrapper">
      <div class="spinner-overlay__spinner" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps({
  type: { type: String as () => 'button' | 'card' | 'screen', default: 'screen' },
  backgroundColor: { type: String, required: false }
})

const typeClass = computed(() => ({
  'spinner-overlay--button-spinner': props.type === 'button',
  'spinner-overlay--card-spinner': props.type === 'card',
  'spinner-overlay--screen-spinner': props.type === 'screen',
  'spinner-overlay--bg-color': props.backgroundColor
}))

const bgColor = computed(() => props.backgroundColor)
</script>

<style lang="scss" scoped>
@use '@/assets/style/config/variables.scss' as *;

.spinner-overlay {
  inset: 0;
  z-index: 100;

  background-color: rgba($black, 0.3);

  &--button-spinner {
    position: absolute;
    border-radius: 5px;
    background-color: $black;
  }

  &--button-spinner & {
    &__spinner-wrapper {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    &__spinner {
      border-width: 4px;
      width: 1.5em;
      height: 1.5em;
    }
  }

  &--card-spinner {
    position: absolute;
    border-radius: 15px;
    background-color: $layoutBackground;
  }

  &--card-spinner & {
    &__spinner-wrapper {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    &__spinner {
      border-width: 4px;
      width: 50px;
      height: 50px;
    }
  }

  &--screen-spinner {
    position: fixed;
  }

  &--screen-spinner & {
    &__spinner-wrapper {
      top: 35%;
      transform: translateX(-50%);
    }

    &__spinner {
      border-width: 8px;
      width: 80px;
      height: 80px;
    }
  }

  &--bg-color {
    background-color: v-bind(bgColor);
  }

  &__spinner-wrapper {
    position: absolute;
    left: 50%;
  }

  &__spinner {
    border-style: solid;
    border-color: $sunglow;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
  }
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
