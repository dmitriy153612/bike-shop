<template>
  <div class="page">
    <app-container class="page__top-container">
      <app-breadcrumbs class="page__breadcrumbs" :breadcrumbs="breadcrumbs" />
      <app-title class="page__title" v-if="title">
        {{ title }}
      </app-title>
    </app-container>
    <main class="page__main">
      <slot></slot>
    </main>
  </div>
</template>

<script lang="ts" setup>
import AppContainer from '@/components/AppContainer.vue'
import AppTitle from '@/components/AppTitle.vue'
import AppBreadcrumbs from '@/components/AppBreadcrumbs.vue'
import { type PropType } from 'vue'
import { type Breadcrumbs } from '@/interfaces/BreadcrumbsInterface'

defineProps({
  title: String,
  breadcrumbs: { type: Array as PropType<Breadcrumbs[]>, required: true }
})
</script>

<style lang="scss" scoped>
@import '@/assets/style/config/variables.scss';

.page {
  &__top-container {
    display: grid;
    row-gap: 16px;
    margin-bottom: 20px;
    padding-top: 10px;
  }
}
</style>
