<script setup lang="ts">
import Header from "./Header.vue";
import Footer from "./Footer.vue";

</script>

<!--<template>
  <div class="DefaultLayout">
    <Header />
    <slot></slot>
    <Footer />

  </div>
</template>-->

<template>
<!--  <div class="h-screen flex flex-col overflow-auto">-->
  <div class="min-h-screen flex flex-col items-center bg-gray-50">

<!--    <div class="w-full max-w-[430px] flex flex-col flex-1">-->
    <div class="w-full flex flex-col flex-1">
    <main class="flex-1 overflow-auto">
      <slot></slot>
    </main>


    <Section />
  </div>
  </div>
</template>



<style scoped>
.DefaultLayout {
}
</style>
