<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import apiClient from "@/api/apiClient";

const router = useRouter();
const route = useRoute();

onMounted(async () => {
  const code = route.query.code as string;
  console.log("code: ", code);
  try {
    const response = await apiClient.post("/api/member/register/google", { code });
    const data = await response.data;
    console.log("response: ", response);
    console.log("response's data: ", data);
    // 구글 로그인 성공 시 홈으로 이동
    if (response.status == 200) {
      router.push("/home");
    } else {
      alert(data.message || "구글 로그인 실패");
    }
  } catch (error) {
    alert(error + ": 구글 로그인 처리 중 오류가 발생했습니다.");
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
      <div>구글 로그인 중입니다.</div>
      <div>잠시만 기다려주세요.</div>
    </h2>
  </div>
</template>