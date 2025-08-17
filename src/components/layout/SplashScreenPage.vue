<!--
SplashScreen 컴포넌트

1. 앱 실행 시 초기 화면에 표시되는 스플래시 화면
2. 중앙에 로고와 배경 애니메이션(bounce) 표시
3. 하단에 앱 슬로건과 이름을 텍스트로 보여줌
4. 2초 후 자동으로 홈 화면(/home)으로 라우팅
5. 화면 전체를 차지하며 사용자에게 초기 로딩 느낌 제공
-->
<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

onMounted(() => {
  setTimeout(() => {
    router.push("/home");
  }, 2000); // 2초 후 / = 홈 화면 이동
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
    <h2 class="flex flex-col items-center text-3xl font-pretendard-bold gap-2">
      <div>안전한 거래의 시작</div>
      <div>Light House</div>
    </h2>
  </div>
</template>

<style scoped></style>
