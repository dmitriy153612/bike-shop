<template>
  <div class="app">
    <the-svg-sprite />
    <the-header class="app__header" />
    <main class="main app__main">
      <router-view />
      <transition name="appear">
        <app-spinner v-if="globalStore.isMainSpinnerShown" />
      </transition>
    </main>
    <the-footer class="app__footer" />
  </div>
</template>

<script lang="ts" setup>
import TheHeader from '@/components/TheHeader.vue'
import TheFooter from '@/components/TheFooter.vue'
import AppSpinner from '@/components/common/AppSpinner.vue'
import TheSvgSprite from '@/components/TheSvgSprite.vue'
import { useGlobalStore } from '@/stores/globalStore'

const globalStore = useGlobalStore()
</script>
