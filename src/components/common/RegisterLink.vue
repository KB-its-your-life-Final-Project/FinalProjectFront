<script lang="ts">
/**
 * 회원가입 유도 컴포넌트.
 * 아직 회원이 아닌 경우 안내 텍스트와 "가입하기" 링크 표시.
 */
</script>
<template>
  <div class="flex gap-3 mt-[2rem]">
    <span class="text-kb-ui-04">아직 회원이 아니신가요?</span>
    <router-link to="/auth/register">
      <span class="text-positive">가입하기</span>
    </router-link>
  </div>
</template>
