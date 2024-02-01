<template>
  <footer class="footer">
    <div class="section footer__inner">
      <ul class="footer__links footer__links-1">
        <li v-for="(data, index) in linksData" :key="index">
          <a class="footer__link" :href="data.href">
            {{ data.linkName }}
          </a>
        </li>
      </ul>

      <ul class="footer__social social">
        <li v-for="(data, index) in socialLinksData" :key="index" class="social__item">
          <a class="social__link" :href="data.href" :aria-label="data.linkName">
            <svg fill="currentColor">
              <use :xlink:href="data.svgId" />
            </svg>
          </a>
        </li>
      </ul>

      <ul class="footer__links footer__links-2">
        <li v-for="(data, index) in dataLinksData" :key="index">
          <a class="footer__link" :href="data.href">
            {{ data.linkName }}
          </a>
        </li>
      </ul>

      <span class="footer__copyright"> © 2023 Mountain bikes </span>
    </div>
  </footer>
</template>

<script lang="ts" setup>
const linksData = [
  { linkName: 'Каталог', href: '#' },
  { linkName: '8 999 999 99 99', href: 'tel:89999999999' },
  { linkName: 'mountain-bikes@bike.com', href: 'mailto:mountain-bikes@bike.com' },
  { linkName: 'Распродажа', href: '#' },
  { linkName: 'Заказать звонок', href: '#' }
]

const socialLinksData = [
  { linkName: 'Телеграм', svgId: '#telegram', href: '#' },
  { linkName: 'Твиттер', svgId: '#twitter', href: '#' },
  { linkName: 'Вконтакте', svgId: '#vk', href: '#' }
]

const dataLinksData = [
  { linkName: 'Политика конфиденциальности', href: '#' },
  { linkName: 'Публичная оферта', href: '#' }
]
</script>
