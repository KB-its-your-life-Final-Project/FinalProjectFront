<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();

onMounted(async () => {
  const route = useRoute();
  const code = route.query.code as string;

  if (!code) {
    alert("인가 코드가 없습니다.");
    return;
  }
  try {
    const response = await fetch("/api/member/register/kakao", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    const data = await response.json();

    if (data.success) {
      router.push("/"); // 로그인 성공 시 홈으로 이동
    } else {
      alert(data.message || "카카오 로그인 실패");
    }
  } catch (error) {
    alert(error + ": 카카오 로그인 처리 중 오류가 발생했습니다.");
  }
});
</script>

<template>
  <div class="flex items-center justify-center min-h-screen text-xl font-semibold">
    카카오 로그인 처리 중입니다...
  </div>
</template>