<!-- LocalInfoPage.vue 동네.zip  레이아웃 -->

<script setup lang="ts">
import Section from "@/components/common/Section.vue";
import Header from "@/components/layout/Header.vue";
</script>
<template>
  <!--제목에 . 이 들어가는 게 좋지 않아서,.. 나중에 db 로 불러오는 걸로 바꿔주세여-->
  <Header :title="'동네.ZIP'" :showBack="true" :showAlarm="true"> </Header>

  <h1 class="text-xl font-bold">동네정보</h1>
  <ul class="mt-4 space-y-2">
    <li>실거래가 조회</li>
    <li>안심 정보</li>
    <li>찜한 매물</li>
    <li>서비스 소개</li>
    <!-- 실제 라우팅 연결은 필요에 따라 RouterLink 사용 -->
  </ul>
  <Section />
</template>
