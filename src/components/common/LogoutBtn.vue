<script setup>
import { authStore } from "@/stores/authStore";
import { Api } from "@/api/autoLoad/Api";

const auth = new authStore();
const api = new Api();

const logout = async () => {
  try {
    await api.logoutUsingPost();
    console.log("LogoutVBtrn으로 로그아웃 성공!");
  } catch (error) {
    console.error("로그아웃 실패:", error);
  }
};
</script>

<template>
  <button class="btn" type="button" @click="logout">로그아웃</button>
</template>

<style scoped>
.btn {
  width: 100px;
  height: 100px;
  border: 1px solid black;
}
</style>
