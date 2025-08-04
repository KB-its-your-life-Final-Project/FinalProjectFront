<template>
  <div class="pb-24">
    <Header :headerShowtype="mainRouteName.myAlarm">
      <div class="flex flex-col items-center">
      <img src="@/assets/imgs/profile.jpg" class="w-16 h-16 rounded-full mb-2" />
        <div class="text-center">
        <p class="font-bold">홍길동</p>
        <p class="text-sm text-gray-500">HONGG@MAIL.COM <font-awesome-icon :class="FontAwesomeIcon" class="text-green-500" /></p>
      </div>
      </div>
    </Header>
    <div class="p-4 mt-4">
    <CardItem
      icon="fa-solid fa-list-check"
      title="계약 필수 체크리스트"
      content="[D-14] 전입신고 마감일이 2주 남았어요! 지금 바로 확인해보세요."
      timeAgo="1일 전"
    />
    <CardItem
      icon="fa-solid fa-triangle-exclamation"
      title="주택 위협도 변동 알림"
      content="계약하신 주택의 불법 거래지수가 하락하여 안심 점수가 85점으로 조정되었어요."
      timeAgo="3일 전"
    />
    <CardItem
      icon="fa-solid fa-file-contract"
      title="계약 갱신 정보"
      content="계약 만료 90일 전입니다. 주변 시세와 비교하여 재계약 여부를 점검하세요."
      timeAgo="1주 전"
    />
    <CardItem
      icon="fa-solid fa-arrow-rotate-right"
      title="시스템 업데이트"
      content="새로운 기능이 추가되었습니다. 앱을 업데이트하여 새 기능을 이용해보세요."
      timeAgo="2일 전"
    />
    <CardItem
      icon="fa-solid fa-chart-pie"
      title="시장 동향 리포트"
      content="이번 부동산 시장 통합 리포트가 업데이트되었습니다. 지금 확인해보세요."
      timeAgo="3주 전"
    />
  </div>
  </div>
</template>

<script setup lang="ts">
import CardItem from './CardItem.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { mainRouteName } from "@/router/mainRoute.ts";
import Header from "@/components/layout/header/Header.vue";

</script>
