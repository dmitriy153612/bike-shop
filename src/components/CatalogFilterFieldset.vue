<template>
  <fieldset class="filter-fieldset">
    <legend class="filter-fieldset__legend">
      {{ legend }}
    </legend>
    <slot />
  </fieldset>
</template>

<script lang="ts" setup>
defineProps({
  legend: { type: String, required: true }
})
</script>

<style lang="scss" scoped>
@import '@/assets/style/config/variables.scss';

.filter-fieldset {
  margin: 0;
  padding: 0;
  border: none;

  &__legend {
    margin-bottom: 5px;
    font-weight: 500;
    font-size: 16px;
    color: $sunglow;

    @media #{$screen-huge} {
      font-size: 20px;
    }
  }
}
</style>
