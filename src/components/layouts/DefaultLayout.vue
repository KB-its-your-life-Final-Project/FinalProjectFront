<script setup lang="ts">
import Header from "./Header.vue";
import Footer from "./Footer.vue";
import NavBar from "./NavBar.vue";
</script>

<template>
  <div class="DefaultLayout">
    <!-- <Header /> -->
    <slot></slot>
    <!-- <Footer /> -->
    <!-- <NavBar /> -->
  </div>
</template>

<style scoped>
.DefaultLayout {
}
</style>
