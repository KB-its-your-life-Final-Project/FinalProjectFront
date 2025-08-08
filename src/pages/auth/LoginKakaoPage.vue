<script setup lang="ts">
import { onMounted, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { authStore } from "@/stores/authStore";
import type { LoginRequestDTO } from "@/api/autoLoad/data-contracts";

const route = useRoute();

const router = useRouter();
const auth = authStore();

const member = reactive<LoginRequestDTO>({
  email: "",
  password: "",
  code: "",
  createdType: 2,
});

onMounted(async () => {
  const code = route.query.code as string;
  member.code = code;
  console.log("code: ", code);
  try {
    const response = await auth.login(member);
    console.log("response: ", response);
    router.push("/");
  } catch (error) {
    alert(error + ": 카카오 로그인 처리 중 오류가 발생했습니다.");
  }
});
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen gap-15">
    <h1 class="relative w-[190px] h-[190px]">
      <div
        class="absolute w-full h-full rounded-full animate-bounce bg-kb-yellow z-0 translate-x-7 translate-y-9 opacity-20"
      ></div>
      <img class="absolute w-full h-full z-9" src="@/assets/imgs/logo.svg" alt="로고 이미지" />
    </h1>
    <h2 class="flex flex-col items-center text-2xl font-pretendard-bold gap-2">
      <div>카카오 로그인 중입니다.</div>
      <div>잠시만 기다려주세요.</div>
    </h2>
  </div>
</template>
