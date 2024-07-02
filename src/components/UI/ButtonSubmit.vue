<template>
  <component
    :is="elementType"
    class="btn-submit"
    :class="{ 'btn-submit--loading': showSpinner }"
    :type="elementType === 'button' ? 'submit' : null"
  >
    <slot />
    {{ btnName }}
    <transition name="appear">
      <app-spinner v-if="showSpinner" type="button" />
    </transition>
  </component>
</template>

<script lang="ts" setup>
import AppSpinner from '@/components/AppSpinner.vue'
import { type PropType } from 'vue'

defineProps({
  btnName: { type: String, required: true },
  elementType: { type: String as PropType<'button' | 'router-link'>, default: 'button' },
  showSpinner: { type: Boolean, default: false }
})
</script>

<style lang="scss" scoped>
@import '@/assets/style/config/variables.scss';

.btn-submit {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  border: 2px solid $sunglow;
  border-radius: 5px;
  padding: 7px 15px;
  font-size: 18px;
  font-weight: 500;
  background-color: $sunglow;
  cursor: pointer;
  transition: color 0.2s ease;
  transition-property: color, background-color, border-color;
  transition-duration: 0.2s;
  transition-timing-function: ease;
  outline: none;
  text-decoration: none;

  &--loading {
    pointer-events: none;
    user-select: none;
    color: transparent;
  }

  &:visited {
    color: inherit;
  }

  & :deep(svg) {
    height: 1.2em;
    width: 1.2em;
  }

  &:focus {
    color: $grenadier;
  }

  @media #{$hover-min-width} {
    &:hover {
      background-color: $black;
      color: $sunglow;
    }
  }

  &:active {
    color: $grenadier;
  }
}
</style>
