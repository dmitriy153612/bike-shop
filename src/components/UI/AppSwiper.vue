<template>
  <swiper
    :style="{
      '--swiper-navigation-color': '#FDD835',
      '--swiper-navigation-color-inactive-opacity': '0.8',
      '--swiper-pagination-color': '#FDD835',
      '--swiper-pagination-bullet-height': '10px',
      '--swiper-pagination-bullet-width': '26px',
      '--swiper-pagination-bullet-border-radius': '5px',
      '--swiper-pagination-bullet-inactive-color': '#FDD835',
      '--swiper-pagination-bullet-inactive-opacity': '0.3'
    }"
    :space-between="10"
    :pagination="{
      clickable: true
    }"
    :navigation="true"
    :modules="modules"
  >
    <swiper-slide v-for="(url, index) in imagesUrls" :key="index">
      <img loading="lazy" :src="url" :alt="title" />
    </swiper-slide>
  </swiper>
</template>

<script lang="ts" setup>
import { type PropType, ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Navigation } from 'swiper/modules'

defineProps({
  imagesUrls: { type: Array as PropType<string[]>, required: true },
  title: { type: String, required: true }
})

const modules = ref([Navigation, Pagination])
</script>
