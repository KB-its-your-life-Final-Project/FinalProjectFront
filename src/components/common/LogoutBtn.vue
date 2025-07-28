<script setup>
import { authStore } from "@/stores/authStore";

const auth = authStore();

const logout = async () => {
  if (auth.logout) {
    await auth.logout();
  } else {
    console.error("logoutUser is undefined");
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
