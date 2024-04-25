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

<style lang="scss" scoped>
.color-box {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  padding: 0 5px;

  &__title {
    margin: 0 0 10px;
    font-size: 14px;
    font-weight: 400;
  }

  &__color {
    height: 25px;
    border-radius: 5px;
  }
}
</style>
