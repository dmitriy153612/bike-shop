<template>
  <div class="color-box">
    <span class="color-box__title">Цвет:</span>
    <span
      class="color-box__color"
      :aria-label="colorName"
      :style="{ 'background-color': colorCode }"
    />
  </div>
</template>

<script lang="ts" setup>
defineProps({
  colorCode: { type: String, required: true },
  colorName: { type: String, required: true }
})
</script>
