<template>
  <form class="form-confirm">
    <h3 class="form-confirm__title">
      {{ message }}
    </h3>
    <div class="form-confirm__buttons">
      <button-reset
        ref="confirmBtnComponent"
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
import { ref, onMounted, type Ref } from 'vue'
import ButtonReset from '@/components/UI/ButtonReset.vue'

const emit = defineEmits(['closeModal', 'action'])

defineProps({
  confirmName: { type: String, required: true },
  cancelName: { type: String, default: null },
  message: { type: String, required: true }
})

const confirmBtnComponent: Ref<{ element: HTMLButtonElement | null } | null> = ref(null)

function transferEvent() {
  emit('action')
}

function closeModal() {
  emit('closeModal')
}

onMounted(() => {
  if (confirmBtnComponent.value && confirmBtnComponent.value.element) {
    confirmBtnComponent.value.element.focus()
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/style/config/variables.scss';

.form-confirm {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 10px;
  padding-bottom: 20px;

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
  }

  &__btn {
    width: 45%;
  }
}
</style>
