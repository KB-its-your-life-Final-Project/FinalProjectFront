<!--MapPage 레이아웃-->
<script setup lang="ts">
import Header from "@/components/layout/Header.vue";
import Section from "@/components/common/Section.vue";
import LogoSearchBar from "@/components/common/LogoSearchBar.vue";
</script>

<template>
  <div class="min-h-screen flex flex-col items-center bg-kb-ui-11">
    <div class="w-full flex flex-col flex-1 pb-[6rem]">
      <!--  max-w-md  :늘리고 싶지 않으면  -->
      <Header :title="'아파트 검색'" :showBack="true" :showAlarm="true">
        <!-- 검색창 -->
        <div class="relative mt-[3rem] px-[1rem]">
          <LogoSearchBar/>
        </div>
      </Header>
      <!-- 지도부분 넣어주세요!!!! -->
      <div class="w-full h-[25rem] bg-kb-ui-08 mt-[1.5rem] rounded-xl">
        <!-- 지도 API   -->
        <p class="text-center pt-[5rem] text-kb-ui-06">지도 불러오는 영역</p>
      </div>
    </div>
    <Section />
  </div>
</template>
