<!-- LocalInfoPage.vue 동네.zip  검색 레이아웃 -->

<script setup lang="ts">
import Header from "@/components/layout/header/Header.vue";
import { mainRouteName } from "@/router/mainRoute";
</script>
<template>
  <Header :headerShowtype="mainRouteName.localInfoSearch" />
</template>
