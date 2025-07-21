<template>
  <Header :title="'알림'" :showBack="true" :showAlarm="false" />
  <!--노란색 배경의 크기를 다른 페이지들과 맞추고 싶다면  <div class="h-[3rem]"></div> -->
  <!--안에 컨텐츠 없으면 자동으로 작아짐!-->
  <h1 class="text-xl font-bold">알림 설정</h1>

  <ul class="mt-4 space-y-2">
    <li>1</li>
    <li>2</li>
    <li>3</li>
    <li>4</li>
    <!-- 실제 라우팅 연결은 필요에 따라 RouterLink-->
  </ul>
  <Section />
</template>

<script setup lang="ts">
// 나중에 로직이 들어갈 수 있음
import Section from "@/components/common/Section.vue";
import Header from "@/components/layout/Header.vue";
</script>
