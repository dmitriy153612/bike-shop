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
