<script setup lang="ts">
import Section from "@/components/common/Section.vue";
import movePage from "@/utils/movePage";
import Header from "@/components/layout/Header.vue";

/*회원가입한 데이터를 받아오기!*/
/* (예시) const userStore = useUserStore()
const name = userStore.name
const email = userStore.email*/

function goToEditPage() {
  movePage.edit();
}
</script>

<template>
  <div class="pb-24">
    <Header :title="'마이페이지'" :showBack="true" :showAlarm="true" />

    <div class="bg-kb-ui-11 mx-4 mt-4 p-4 rounded-xl shadow-md flex items-center space-x-4">
      <img src="@/assets/imgs/profile.jpg" alt="Profile" class="w-14 h-14 rounded-full" />
      <div class="flex-1">
        <p class="font-semibold text-sm">{{ "name" }}</p>
        <p class="text-xs text-kb-ui-07">{{ "email" }}</p>
      </div>
      <button class="text-xs text-positive font-medium" @click="goToEditPage">회원정보 수정</button>
    </div>

    <div class="bg-kb-ui-11 mx-4 mt-4 p-4 rounded-xl shadow-md">
      <h3 class="text-sm font-semibold mb-1">계약 만료 정보</h3>
      <p class="text-sm">2024-08-15</p>
      <p class="text-xs text-kb-ui-07">5일 남음</p>
    </div>

    <div class="bg-kb-ui-11 mx-4 mt-4 p-4 rounded-xl shadow-md">
      <h3 class="text-sm font-semibold mb-1">시세 변화</h3>
      <p class="text-sm">₩300,000,000</p>
      <p class="text-xs text-kb-ui-07">+5% (지난주 대비)</p>
    </div>

    <div class="mx-4 mt-4">
      <button class="w-full py-3 bg-kb-ui-09 text-sm rounded-full shadow-inner">알림 설정</button>
    </div>

    <Section />
  </div>
</template>

<!--
<script setup lang="ts">
import Header from '@/components/layouts/Header.vue';
import { ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

</script>

<template>

    <BackHeader title="마이페이지">

  </BackHeader>

</template>
-->
