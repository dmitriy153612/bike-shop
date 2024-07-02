<template>
  <button class="btn-reset">
    {{ btnName }}
  </button>
</template>

<script lang="ts" setup>
defineProps({
  btnName: { type: String, required: true }
})
</script>

<style lang="scss" scoped>
@import '@/assets/style/config/variables.scss';

.btn-reset {
  border: 1px solid $white;
  background-color: $black;
  border-radius: 5px;
  color: $white;
  cursor: pointer;
  outline: none;
  transition:
    border-color 0.2s ease,
    color 0.2s ease;

  @media #{$screen-huge} {
    padding-top: 5px;
    padding-bottom: 5px;
    font-size: 18px;
  }

  &:focus {
    border-color: $sunglow;
  }

  @media #{$hover-min-width} {
    &:hover {
      border-color: $sunglow;
      color: $sunglow;
    }
  }
}
</style>
