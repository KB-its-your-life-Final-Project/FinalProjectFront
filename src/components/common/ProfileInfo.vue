<!--
사용자 프로필 정보 컴포넌트.
props로 name, email을 받아 표시하며, authStore의 createdType이 0이 아닐 경우 체크 아이콘 표시.
-->
<script setup lang="ts">
import { authStore } from "@/stores/authStore";
import { computed } from "vue";
import kakaoIcon from "@/assets/imgs/kakao.svg";
const auth = authStore();

const props = defineProps<{
  name: string;
  email: string | null;
}>();

// 이메일 표시 처리
const displayEmail = computed(() => {
  return props.email && props.email.trim() !== "" ? props.email : "카카오 로그인";
});
</script>

<template>
  <div class="flex-1 flex flex-col items-center">
    <p class="text-xl font-pretendard-bold">{{ name }}</p>
    <p class="text-xl font-pretendard-bold flex items-center gap-1">
      {{ displayEmail }}
      <img v-if="auth.member.createdType == 2" class="w-4 h-4" :src="kakaoIcon" alt="check" />
      <font-awesome-icon
        v-if="auth.member.createdType != 0 && auth.member.createdType != 2"
        class="border rounded-full p-[2px] w-2 h-2 text-success"
        :icon="['fas', 'check']"
      />
    </p>
  </div>
</template>
