<template>
  <div class="app">
    <the-svg-sprite />
    <the-header />
    <div class="app__content">
      <router-view />
      <transition name="appear">
        <app-spinner v-if="globalStore.isMainSpinnerShown" />
      </transition>
    </div>
    <the-footer />
  </div>
</template>

<script lang="ts" setup>
import TheHeader from '@/components/TheHeader.vue'
import TheFooter from '@/components/TheFooter.vue'
import AppSpinner from '@/components/AppSpinner.vue'
import TheSvgSprite from '@/components/TheSvgSprite.vue'
import { useGlobalStore } from '@/stores/globalStore'

const globalStore = useGlobalStore()
</script>

<style lang="scss" scoped>
.app {
  display: grid;
  grid-template-rows: 1fr auto;
  &__content {
    position: relative;
    padding-top: 56px;
    padding-bottom: 40px;
  }
}
</style>
