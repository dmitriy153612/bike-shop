<template>
  <ul class="footer__social social">
    <li v-for="(data, index) in socialLinksData" :key="index" class="social__item">
      <a class="social__link" :href="data.href" :aria-label="data.linkName" target="_blank">
        <svg fill="currentColor">
          <use :xlink:href="data.svgId" />
        </svg>
      </a>
    </li>
  </ul>
</template>

<script lang="ts" setup>
const socialLinksData = [
  { linkName: 'Телеграм', svgId: '#telegram', href: '#' },
  { linkName: 'Твиттер', svgId: '#twitter', href: '#' },
  { linkName: 'Вконтакте', svgId: '#vk', href: '#' }
]
</script>

<style lang="scss" scoped>
@use '@/assets/style/config/variables.scss' as *;

.social {
  color: white;
  display: flex;
  &__link svg {
    height: 22px;
    width: 40px;
    transition: color 0.2s ease;
  }
  @media #{$hover-min-width} {
    &__link:hover svg {
      color: $sunglow;
    }
  }
  &__link:active svg {
    color: $grenadier;
  }
}
</style>
