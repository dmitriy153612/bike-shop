import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGlobalStore = defineStore('globalStore', () => {
  const isLoginModalOpen = ref<boolean>(false)
  const isMainSpinnerShown = ref<boolean>(false)
  const isSelectedCartItemAmountChanging = ref<number>(0)
  const isfilterOpen = ref<boolean>(true)

  function openLoginModal(isOpen: boolean): void {
    isLoginModalOpen.value = isOpen
  }

  function showSpinner(show: boolean): void {
    isMainSpinnerShown.value = show
  }

  function updateIsSelectedCartItemAmountChanging(value: number): void {
    isSelectedCartItemAmountChanging.value += value
  }

  function toggleFilter(isOpen: boolean | undefined = undefined) {
    if (isOpen === true || isOpen === false) {
      isfilterOpen.value = isOpen
    } else {
      isfilterOpen.value = !isfilterOpen.value
    }
  }

  return {
    isLoginModalOpen,
    openLoginModal,

    isMainSpinnerShown,
    showSpinner,

    isSelectedCartItemAmountChanging,
    updateIsSelectedCartItemAmountChanging,

    isfilterOpen,
    toggleFilter
  }
})
