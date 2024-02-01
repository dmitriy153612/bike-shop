<template>
  <app-section class="not-found-sec">
    <Apptitle> Страница не найдена </Apptitle>
  </app-section>
</template>

<script lang="ts" setup>
import AppSection from '@/components/common/AppSection.vue'
import Apptitle from '@/components/common/AppTitle.vue'
import { useGlobalStore } from '@/stores/globalStore'

const globalStore = useGlobalStore()

globalStore.showSpinner(false)
</script>
