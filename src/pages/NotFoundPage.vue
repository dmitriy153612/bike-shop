<template>
  <main class="not-found-page">
    <app-container class="not-found-page__container">
      <Apptitle class="not-found-page__title"> Страница не найдена </Apptitle>
    </app-container>
  </main>
</template>

<script lang="ts" setup>
import AppContainer from '@/components/AppContainer.vue'
import Apptitle from '@/components/AppTitle.vue'
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
