<template>
  <div class="catalog-counter">
    найдено <b>{{ amount }}</b> шт.
  </div>
</template>

<script lang="ts" setup>
defineProps({
  amount: { type: Number, required: true }
})
</script>
