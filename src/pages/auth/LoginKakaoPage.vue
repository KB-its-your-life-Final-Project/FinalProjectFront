<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import apiClient from "@/api/apiClient";

const router = useRouter();

onMounted(async () => {
  const route = useRoute();
  const code = route.query.code as string;
  console.log("code: ", code);

  if (!code) {
    alert("인가 코드가 없습니다.");
    return;
  }
  try {
    const response =  await apiClient.post("/api/member/register/kakao", { code });
    console.log("response: ", response);

    const data = await response.data;
    console.log("response's data: ", data);

    if (response.status == 200) {
      router.push("/home"); // 로그인 성공 시 홈으로 이동
    } else {
      alert(data.message || "카카오 로그인 실패");
    }
  } catch (error) {
    alert(error + ": 카카오 로그인 처리 중 오류가 발생했습니다.");
  }
});
</script>

<template>
  <div class="flex items-center justify-center min-h-screen text-xl font-pretendard-black">
    카카오 로그인 처리 중입니다...
  </div>
</template>
