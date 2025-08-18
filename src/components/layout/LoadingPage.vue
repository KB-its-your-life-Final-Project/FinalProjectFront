<script setup lang="ts">
/**
 * 로딩 페이지 컴포넌트
 * 앱 실행 시 초기 화면으로 표시되며, 중앙에 로고와 슬로건을 보여줌
 * 로고 뒤 배경 원은 애니메이션 효과로 시각적 포인트를 줌
 */
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
