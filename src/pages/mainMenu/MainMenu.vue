

<script setup lang="ts">
// 필요 시 기능 추가
import Header from '@/components/layout/header/Header.vue'
import MenuItem from '@/components/menu/MenuItems.vue'
import MenuSection from '@/components/menu/MenuSection.vue';
/*임의로 로그아웃, 회원탈퇴 부분 넣겠습니다.*/

import { mainRouteName } from "@/router/mainRoute";


function logout() {
  alert("로그아웃 처리합니다.")
  // 로그아웃의 로직을 추가해주세요
}

function withdraw() {
  alert("요청 중...")
  // 회원탈퇴의 로직을 추가해주세요
}

function openInquiry() {
  alert('lighthouse@gmail.com 로 문의 주세요!')
}


</script>


<!-- MenuPage.vue 레이아웃 -->
<template>

  <Header :headerShowtype="mainRouteName.mainMenu" >
    <!--Header 부분에 회원 정보가 크게 띄게 수정-->
    <div class ="p-4">
      <!--어떤 식으로 회원 정보를 받아올 것인지 - 홍길동은 예시임 + 업로드 기능 (사진 추가해야 함)   -->
      <div class="text-lg font-bold text-kb-ui-01 items-center">{{ "홍길동" }}</div>
      <div class="text-sm text-kb-ui-01">{{ "GILLDONG@MAIL.COM" }}</div>
    </div>
  </Header>


  <div class="p-4 space-y-6">

    <MenuSection title="계정">
      <MenuItem :icon="['far', 'user']" label="마이페이지" to="/" />
      <MenuItem :icon="['fas', 'house']" label="실거래가 조회" to="/mapSearch" />
      <MenuItem :icon="['fas', 'shield-alt']" label="안심 정보" to="/safereport" />
      <MenuItem :icon="['far', 'heart']" label="찜한 매물" to="/myLike" />
      <MenuItem :icon="['far', 'file-lines']" label="최근 본 리포트" to="/" />
      <!--      -->
    </MenuSection>


    <MenuSection title="설정">
      <MenuItem :icon="['fas', 'bell']" label="알림 설정" to="/myAlarm" />
    </MenuSection>


    <MenuSection title="고객지원 및 안내">
      <div @click="openInquiry">
        <MenuItem :icon="['far', 'envelope']" label="서비스 문의하기" />
      </div>
    </MenuSection>
  </div>


  <div class="mt-8 flex justify-center gap-40 text-sm text-kb-ui-05 pb-6">
    <button @click="withdraw" class="underline">회원탈퇴</button>
    <button @click="logout" class="underline">로그아웃</button>
  </div>
</template>
