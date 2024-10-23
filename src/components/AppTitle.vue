<template>
  <h1 class="title">
    <slot />
  </h1>
</template>

<style lang="scss" scoped>
@use '@/assets/style/config/variables.scss' as *;

.title {
  display: block;
  margin: 0;
  color: $sunglow;
  font-size: 30px;
  color: $black;
  text-shadow: 1px 1px 2px rgba($black, 0.5);
}
</style>
