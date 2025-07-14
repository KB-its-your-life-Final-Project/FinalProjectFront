<script setup lang="ts">
import Header from "./Header.vue";
import Footer from "./Footer.vue";
import NavBar from "./NavBar.vue";
</script>

<!--<template>
  <div class="DefaultLayout">
    <Header />
    <slot></slot>
    <Footer />
    <NavBar />
  </div>
</template>-->

<template>
  <div class="h-screen flex flex-col overflow-auto">
    <Header class ="h-[100px]" />

    <main class="flex-1 overflow-auto">
      <slot></slot>
    </main>

    <Footer class ="h-[60px]"/>
    <NavBar class ="h-[60px]" />
  </div>
</template>



<style scoped>
.DefaultLayout {
}
</style>
