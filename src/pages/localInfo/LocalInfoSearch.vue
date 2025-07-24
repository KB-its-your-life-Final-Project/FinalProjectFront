<!-- LocalInfoPage.vue 동네.zip  검색 레이아웃 -->

<script setup lang="ts">
import Header from "@/components/layout/header/Header.vue";
import { mainRouteName } from "@/router/mainRoute";
</script>
<template>
  <Header :headerShowtype="mainRouteName.localInfoSearch" />
  <div class="w-full h-full flex-col px-4 mt-8">
    <div class="font-pretendard-bold text-3xl text-kb-ui-01">지역을</div>
    <div class="font-pretendard-bold text-3xl text-kb-ui-01">검색해주세요</div>
    <div class="w-ful h-full mt-8">
      <input
        type="text"
        placeholder="검색"
        class="w-full rounded-xl border-2 border-kb-yellow bg-white shadow-sm px-4 py-2"
      />
    </div>
  </div>
</template>
