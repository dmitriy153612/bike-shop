<template>
  <fieldset class="order-fieldset">
    <legend class="order-fieldset__legend">
      {{ legend }}
    </legend>
    <slot />
  </fieldset>
</template>

<script lang="ts" setup>
defineProps({ legend: { type: String, required: true } })
</script>

<style lang="scss" scoped>
@import '@/assets/style/config/variables.scss';

.order-fieldset {
  position: relative;
  margin: 0;
  padding: 18px;
  border-radius: 15px;
  border-color: transparent;
  box-shadow: 0px 0px 4px 2px rgba($black, 0.1);

  &__legend {
    position: absolute;
    top: -28px;
    left: 18px;
    font-size: 18px;
  }
}
</style>
