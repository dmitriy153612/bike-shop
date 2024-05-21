<template>
  <div class="container">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/style/config/variables.scss';
.container {
  max-width: 1440px;
  min-width: $containerMinWidth;
  margin: 0 auto;
  padding-inline: $containerInlinePadding;
}
</style>
