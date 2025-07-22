<script setup lang="ts">
import { ref } from "vue";
import Section from "@/components/nav/BottomNav.vue";
import Header from "@/components/layout/header/Header.vue";
</script>

<template>
  <Header :title="'회원정보 수정'" :showAlarm="true" />

  <div class="editPage">
    <h1>사용자 정보 수정 화면</h1>
    <p>내 집, 학교, 회사 등록/수정하기</p>
  </div>
  <Section />
</template>

<style scoped></style>
