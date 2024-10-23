<template>
  <button class="login-btn">
    <svg v-if="svgId" class="login-btn__svg">
      <use xlink:href="#user" />
    </svg>
    <span v-if="btnText">{{ btnText }}</span>
  </button>
</template>

<script lang="ts" setup>
defineProps({
  svgId: { type: String, default: null },
  btnText: { type: String, default: null }
})
</script>

<style lang="scss" scoped>
@use '@/assets/style/config/variables.scss' as *;

.login-btn {
  display: flex;
  gap: 5px;
  align-items: flex-end;
  border: 1px solid transparent;
  margin: 0;
  padding: 0 5px 0 0;
  max-height: 100%;
  background-color: transparent;
  color: $sunglow;
  outline: none;
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

  & {
    cursor: pointer;
  }

  &__svg {
    display: block;
    stroke: $sunglow;
    fill: transparent;
    width: 30px;
    height: 30px;
    transition: stroke 0.2s ease;
  }
}
</style>
