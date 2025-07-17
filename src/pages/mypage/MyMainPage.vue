<script setup lang="ts">
import BackHeader from '@/components/layouts/BackHeader.vue';
import NavBar from '@/components/layouts/NavBar.vue';

function goToEditPage() {
  router.push('/mypage/edit');
}
</script>

<template>
  <div class="pb-24">

    <BackHeader title="마이페이지" />


    <div class="bg-white mx-4 mt-4 p-4 rounded-xl shadow-md flex items-center space-x-4">
      <img
        src="@/assets/imgs/profile.jpg"
        alt="Profile"
        class="w-14 h-14 rounded-full"
      />
      <div class="flex-1">
        <p class="font-semibold text-sm">{{name}}</p>
        <p class="text-xs text-gray-500">{{email}}</p>
      </div>
      <button class="text-xs text-blue-600 font-medium" @click="goToEditPage">회원정보 수정</button>
    </div>


    <div class="bg-white mx-4 mt-4 p-4 rounded-xl shadow-md">
      <h3 class="text-sm font-semibold mb-1">계약 만료 정보</h3>
      <p class="text-sm">2024-08-15</p>
      <p class="text-xs text-gray-500">5일 남음</p>
    </div>


    <div class="bg-white mx-4 mt-4 p-4 rounded-xl shadow-md">
      <h3 class="text-sm font-semibold mb-1">시세 변화</h3>
      <p class="text-sm">₩300,000,000</p>
      <p class="text-xs text-gray-500">+5% (지난주 대비)</p>
    </div>

    <!-- 알림 설정 -->
    <div class="mx-4 mt-4">
      <button class="w-full py-3 bg-gray-100 text-sm rounded-full shadow-inner">
        알림 설정
      </button>
    </div>

    <!-- 하단 내비게이션 -->
    <NavBar />
  </div>
</template>







<!--
<script setup lang="ts">
import Header from '@/components/layouts/Header.vue';
import { ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import BackHeader from "@/components/layouts/BackHeader.vue";

</script>

<template>

    <BackHeader title="마이페이지">

  </BackHeader>

</template>
-->
