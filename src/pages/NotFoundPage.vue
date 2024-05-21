<template>
  <main class="not-found-page">
    <app-container class="not-found-page__container">
      <AppTitle class="not-found-page__title"> Страница не найдена </AppTitle>
    </app-container>
  </main>
</template>

<script lang="ts" setup>
import AppContainer from '@/components/layouts/AppContainer.vue'
import AppTitle from '@/components/AppTitle.vue'
import { useGlobalStore } from '@/stores/globalStore'

const globalStore = useGlobalStore()

globalStore.showSpinner(false)
</script>

<style lang="scss" scoped>
.not-found-page {
  height: 100%;

  &__container {
    display: flex;
    justify-content: center;
    padding-top: 20px;
  }
}
</style>
