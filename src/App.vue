<script setup lang="ts">
import { RouterView } from "vue-router";
import DefaultLayout from "./components/layout/DefaultLayout.vue";
import ToastList from "@/components/common/ToastList.vue";
</script>

<template>
  <DefaultLayout>
    <RouterView />
  </DefaultLayout>
  <ToastList />
</template>

<style scoped></style>
