<template>
  <form class="form-confirm">
    <h3 class="form-confirm__title">
      {{ message }}
    </h3>
    <div class="form-confirm__buttons">
      <button-reset
        class="form-confirm__btn"
        :btn-name="confirmName"
        @click.prevent="transferEvent"
      />
      <button-reset
        v-if="cancelName"
        class="form-confirm__btn"
        :btn-name="cancelName"
        @click.prevent="closeModal"
      />
    </div>
  </form>
</template>

<script lang="ts" setup>
import ButtonReset from '@/components/UI/ButtonReset.vue'

const emit = defineEmits(['close', 'action'])

defineProps({
  confirmName: { type: String, required: true },
  cancelName: { type: String, default: null },
  message: { type: String, required: true }
})

function transferEvent() {
  emit('action')
}

function closeModal() {
  emit('close')
}
</script>

<style lang="scss" scoped>
@use '@/assets/style/config/variables.scss' as *;

.form-confirm {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 10px;
  padding-bottom: 20px;
  width: 100%;
  &__title {
    grid-column: 1 / 3;
    margin: 0;
    padding-bottom: 30px;
    font-weight: 400;
    color: $sunglow;
    line-height: 150%;
  }

  &__title-descr {
    color: $boulder;
  }

  &__buttons {
    grid-column: 1 / 3;
    display: flex;
    justify-content: center;
    column-gap: 10px;
    width: 100%;
  }

  &__btn {
    width: 45%;
  }
}
</style>
