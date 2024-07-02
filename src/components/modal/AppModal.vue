<template>
  <app-overlay @close="emit('close')">
    <div class="modal" role="dialog" aria-modal="true" @mousedown.stop>
      <button-cross aria-label="закрыть" class="modal__btn-close" @click="emit('close')" />
      <slot />
    </div>
  </app-overlay>
</template>

<script lang="ts" setup>
import ButtonCross from '@/components/UI/ButtonCross.vue'
import AppOverlay from '@/components/layouts/AppOverlay.vue'

const emit = defineEmits(['close'])
</script>

<style lang="scss" scoped>
@import '@/assets/style/config/variables.scss';

.modal {
  position: relative;
  display: flex;
  max-width: 350px;
  padding: 35px 15px 5px;
  background-color: $black;
  width: 100%;
  &__btn-close {
    position: absolute;
    top: 8px;
    right: 8px;
  }
}
</style>
