<template>
  <div class="container">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/style/config/variables.scss' as *;
.container {
  max-width: 1440px;
  min-width: $containerMinWidth;
  margin: 0 auto;
  padding-inline: $containerInlinePadding;
}
</style>
