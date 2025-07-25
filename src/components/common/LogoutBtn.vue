<script setup>
import { authStore } from "@/stores/authStore";

const auth = authStore();

const logoutUser = async () => {
  if (auth.logoutUser) {
    await auth.logoutUser();
  } else {
    console.error("logoutUser is undefined");
  }
};
</script>

<template>
  <button class="btn" type="button" @click="logoutUser">로그아웃</button>
</template>

<style scoped>
.btn {
  width: 100px;
  height: 100px;
  border: 1px solid black;
}
</style>
