<script lang="ts" setup>
/**
 * Dim Overlay 컴포넌트
 * 1. 화면 전체를 덮는 반투명 레이어를 제공
 * 2. slot에 모달이나 팝업 콘텐츠 삽입 가능
 * 3. 배경 클릭 시(close 이벤트) 부모 컴포넌트에 알림
 *  - @click.self="$emit('close')" 적용
 * 4. z-10으로 다른 요소 위에 표시
 * 5. 재사용 가능한 간단한 모달/오버레이 래퍼로 활용
 */
</script>
<template>
  <div class="fixed inset-0 bg-black/50 z-10" @click.self="$emit('close')">
    <slot></slot>
  </div>
</template>
