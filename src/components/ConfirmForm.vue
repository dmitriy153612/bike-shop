<template>
  <form class="form-confirm">
    <h3 class="form-confirm__title">
      {{ message }}
    </h3>
    <div class="form-confirm__buttons">
      <app-button-reset
        ref="confirmBtnComponent"
        class="form-confirm__btn"
        :btn-name="confirmName"
        @click.prevent="transferEvent"
      />
      <app-button-reset
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
import AppButtonReset from '@/components/UI/AppButtonReset.vue'

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
