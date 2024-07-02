<template>
  <button class="btn-cross" :class="{ 'btn-cross--bordered': bordered }">
    <span class="btn-cross__cross">
      <span class="btn-cross__line btn-cross__line--left" />
      <span class="btn-cross__line btn-cross__line--right" />
    </span>
    <span v-if="name" class="btn-cross__name">
      {{ name }}
    </span>
  </button>
</template>

<script lang="ts" setup>
defineProps({
  name: { type: String, default: null },
  bordered: { type: Boolean, default: false }
})
</script>

<style lang="scss" scoped>
@import '@/assets/style/config/variables.scss';

.btn-cross {
  border: 1px solid transparent;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 0;
  color: $grenadier;
  background-color: transparent;
  transition-property: color, border-color;
  transition-duration: 0.2s;
  transition-timing-function: ease;
  outline: none;
  cursor: pointer;

  &--bordered {
    border: 1px solid $alto;
    border-radius: 5px;
    padding: 2px;
    font-size: 14px;
    color: $boulder;
  }

  &--bordered & {
    &__cross {
      height: 1em;
      width: 1em;
    }
  }

  &__cross {
    position: relative;
    display: flex;
    height: 24px;
    width: 24px;
  }

  &__line {
    position: absolute;
    top: 50%;
    width: 100%;
    height: 2px;
    background-color: $sunglow;
    transition: background-color 0.2s ease;
  }

  &__line--right {
    transform: translateY(-50%) rotate(45deg);
  }

  &__line--left {
    transform: translateY(-50%) rotate(-45deg);
  }

  &__name {
    padding-right: 3px;
    white-space: nowrap;
  }

  &:focus {
    border-color: $sunglow;
  }

  @media #{$hover-min-width} {
    &:hover &__cross &__line {
      background-color: darken($sunglow, 15%);
    }

    &:hover {
      color: darken($grenadier, 15%);
    }
  }

  &:active &__cross &__line {
    background-color: $grenadier;
  }
}
</style>
