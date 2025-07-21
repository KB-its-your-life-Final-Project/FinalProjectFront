<!-- MenuPage.vue 레이아웃 -->
<template>

    <Header title="전체 메뉴" >
<!--Header 부분에 회원 정보가 크게 띄게 수정-->
  <div class ="p-4">
<!--어떤 식으로 회원 정보를 받아올 것인지 - 홍길동은 예시임 + 업로드 기능 (사진 추가해야 함)   -->
    <div class="text-lg font-bold text-black items-center">{{ "홍길동" }}</div>
    <div class="text-sm text-kb-ui-01">{{ "GILLDONG@MAIL.COM" }}</div>
  </div>
  </Header>

<!-- <font-awesome-icon :icon="['fas', 'chevron-right']" />
 <font-awesome-icon :icon="['far', 'envelope']" style="color: #FFD43B;" />
<font-awesome-icon :icon="['far', 'heart']" style="color: #FFD43B;" />
<font-awesome-icon icon="user" style="color: #FFD43B;" />
<font-awesome-icon :icon="['far', 'file-lines']" style="color: #FFD43B;" />
 -->

  <div class="p-4">
    <h1 class="text-xl font-bold">전체 메뉴</h1>
<!--    <ul class="mt-4 space-y-2">
      <li>실거래가 조회</li>
      <li>안심 정보</li>
      <li>찜한 매물</li>
      <li>서비스 소개</li>
      &lt;!&ndash; 실제 라우팅 연결은 필요에 따라 RouterLink 사용 &ndash;&gt;
    </ul>-->
  <ul class="space-y-3">
    <MenuItem :icon="['fas', 'house']" label="실거래가 조회" to="/map" />
    <MenuItem :icon="['fas', 'shield-alt']" label="안심 정보" to="/safereport" />
    <MenuItem :icon="['far', 'heart']" label="찜한 매물" to="/favorite" />
    <MenuItem :icon="['far', 'file-lines']" label="최근 본 리포트" to="/" />

    <!-- 라우터 없이 동작하는 메뉴는 부모에서 클릭 처리 -->
    <div @click="openInquiry">
      <MenuItem :icon="['far', 'envelope']" label="서비스 문의하기" />
    </div>
  </ul>
  </div>
</template>

<script setup lang="ts">
// 필요 시 기능 추가
import Header from '@/components/layouts/Header.vue'
import BackHeader from "@/components/layouts/BackHeader.vue";
import MenuItem from '@/components/menu/MenuItems.vue'
function openInquiry() {
  alert('문의하기:lighhouse@mail.com 로 문의 주세요!')
}
/*const ~~=
* onMounted(() => {
* }*/
</script>
