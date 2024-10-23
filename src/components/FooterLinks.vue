<template>
  <ul class="footer-links">
    <li v-for="(data, index) in linksArr" :key="index">
      <a class="footer-links__link" :href="data.href">
        {{ data.linkName }}
      </a>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { type Link } from '@/interfaces/Link'

defineProps({
  linksArr: { type: Array as () => Link[], required: true }
})
</script>

<style lang="scss" scoped>
@use '@/assets/style/config/variables.scss' as *;

.footer-links {
  display: grid;
  gap: 10px;
  font-size: 16px;
  color: $sunglow;

  &__link {
    position: relative;
    outline: none;
    transition: color 0.2s ease;
  }

  &__link::before {
    position: absolute;
    content: '';
    inset-block: -2px;
    inset-inline: -4px;
    border: 1px solid transparent;
    transition: border-color 0.2s ease;
  }

  &__link:focus::before {
    border-color: $sunglow;
  }

  @media #{$hover-min-width} {
    &__link:hover {
      color: $white;
    }
  }
}
</style>
