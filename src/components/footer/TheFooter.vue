<template>
  <footer class="footer">
    <app-container class="footer__inner">
      <footer-links class="footer__links-1" :linksArr="linksData" />
      <app-social class="footer__social" />
      <footer-links class="footer__links-2" :linksArr="dataLinksData" />
      <app-copyright class="footer__copyright" />
    </app-container>
  </footer>
</template>

<script lang="ts" setup>
import AppSocial from '@/components/AppSocial.vue'
import FooterLinks from '@/components/FooterLinks.vue'
import AppCopyright from '@/components/AppCopyright.vue'
import AppContainer from '@/components/layouts/AppContainer.vue'

import { type Link } from '@/interfaces/Link'

const linksData: Link[] = [
  { linkName: 'Каталог', href: '#' },
  { linkName: '8 999 999 99 99', href: 'tel:89999999999' },
  { linkName: 'mountain-bikes@bike.com', href: 'mailto:mountain-bikes@bike.com' },
  { linkName: 'Распродажа', href: '#' },
  { linkName: 'Заказать звонок', href: '#' }
]

const dataLinksData: Link[] = [
  { linkName: 'Политика конфиденциальности', href: '#' },
  { linkName: 'Публичная оферта', href: '#' }
]
</script>

<style lang="scss" scoped>
@use '@/assets/style/config/variables.scss' as *;

.footer {
  background-color: $black;
  &__inner {
    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-template-areas:
      'links-1 social links-2'
      'links-1 social copyright';
    align-items: flex-start;
    column-gap: 16px;
    padding: 20px;

    @media #{$screen-medium} {
      grid-template-columns: 1fr auto;
      grid-template-areas:
        'links-1 social'
        'links-1 links-2'
        'links-1 copyright';
    }

    @media #{$screen-small} {
      grid-template-columns: 1fr;
      gap: 10px;
      grid-template-areas:
        'social'
        'links-1'
        'links-2'
        'copyright';
    }
  }

  &__links-1 {
    grid-area: links-1;
  }
  &__links-2 {
    grid-area: links-2;
  }
  &__social {
    grid-area: social;
    justify-self: center;
    @media #{$screen-medium} {
      justify-self: flex-start;
    }
  }
}
</style>
