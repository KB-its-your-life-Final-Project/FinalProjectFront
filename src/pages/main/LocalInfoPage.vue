<!-- LocalInfoPage.vue 동네.zip  레이아웃 -->

<script setup lang="ts">
import BackHeader from '@/components/layouts/BackHeader.vue';
import NavBar from '@/components/layouts/NavBar.vue';

</script>
<template>

    <BackHeader title="동네.ZIP"/>
    <h1 class="text-xl font-bold">동네정보</h1>
    <ul class="mt-4 space-y-2">
      <li>실거래가 조회</li>
      <li>안심 정보</li>
      <li>찜한 매물</li>
      <li>서비스 소개</li>
      <!-- 실제 라우팅 연결은 필요에 따라 RouterLink 사용 -->
    </ul>

</template>
