<template>
  <router-link class="logo" :to="{ name: 'catalog', query: { page: 1 } }">
    <img class="logo__img" src="@/assets/images/logo.png" alt="логотип сайта" />
  </router-link>
</template>

<style lang="scss" scoped>
@use '@/assets/style/config/variables.scss' as *;

.logo {
  position: relative;
  display: flex;
  justify-self: center;
  height: 40px;
  border-radius: 50%;
  background-color: $sunglow;
  box-shadow: 0px 0px 5px 3px rgba(253, 216, 53, 0.9);
  outline: none;

  &::before {
    position: absolute;
    content: '';
    inset: -6px;
    border: 2px solid transparent;
    border-radius: 50%;
    transition: border-color 0.2s ease;
  }

  &:focus::before {
    border-color: $sunglow;
  }

  &__img {
    height: 40px;
    width: 40px;
  }
}
</style>
