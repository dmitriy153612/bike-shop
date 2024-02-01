import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGlobalStore = defineStore('globalStore', () => {
  const isLoginModalOpen = ref<boolean>(false)
  const isMainSpinnerShown = ref<boolean>(false)
  const isSelectedCartItemAmountChanging = ref<number>(0)

  function openLoginModal(isOpen: boolean): void {
    isLoginModalOpen.value = isOpen
  }

  function showSpinner(show: boolean): void {
    isMainSpinnerShown.value = show
  }

  function updateIsSelectedCartItemAmountChanging(value: number): void {
    isSelectedCartItemAmountChanging.value += value
  }

  return {
    isLoginModalOpen,
    openLoginModal,

    isMainSpinnerShown,
    showSpinner,

    isSelectedCartItemAmountChanging,
    updateIsSelectedCartItemAmountChanging
  }
})
