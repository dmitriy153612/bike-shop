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
