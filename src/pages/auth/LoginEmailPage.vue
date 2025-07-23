<script setup lang="ts">
import { onMounted, computed, reactive, ref } from "vue";
import { authStore } from "@/stores/authStore.ts";
import { useRoute, useRouter } from "vue-router";
import type { RouteLocationNormalizedLoaded } from "vue-router";
import type { AxiosError } from "axios";

interface MemberLoginForm {
  email: string;
  password: string;
}

const route: RouteLocationNormalizedLoaded = useRoute();
const router = useRouter();
const auth = authStore();
const member = reactive<MemberLoginForm>({
  email: "",
  password: "",
});
// const checkSubmitMsg = ref<string>("");
// const disableSubmit = ref<boolean>(true);

onMounted(() => {
  const savedEmail = localStorage.getItem("savedEmail");
  if (savedEmail) {
    member.email = savedEmail;
  }
});

const loginUser = async () => {
  console.log("사용자 input: ", member);
  try {
    await auth.loginUser(member);
    console.log("로그인 성공");
    router.push("/");
  } catch (error) {
    const err = error as AxiosError;
    console.error("로그인 에러:", err);
  }
};
</script>

<template>
  <header class="bg-kb-yellow w-full h-[6rem]">
    <h1 class="text-2xl font-pretendard-bold">로그인</h1>
  </header>
  <div class="flex flex-col items-center">
    <form @submit.prevent="loginUser" method="post" class="w-5/6 h-auto flex flex-col gap-7">
      <div>
        <label for="username">이메일 주소</label>
        <input
          class="w-full h-11 rounded-md"
          type="email"
          placeholder="이메일을 입력하세요"
          v-model="member.email"
        />
      </div>
      <div>
        <label for="password">비밀번호</label>
        <input
          class="w-full h-11 rounded-md"
          type="password"
          placeholder="비밀번호를 입력하세요"
          v-model="member.password"
        />
      </div>
      <p class="w-full h-2 text-center text-error">
        <!-- {{ checkSubmitMsg }} -->
      </p>
      <!-- <button class="btn w-full h-12 rounded-xl text-white" type="submit" :disabled="disableSubmit"> -->
      <button class="btn w-full h-12 rounded-xl text-white" type="submit">
        로그인
      </button>
    </form>
  </div>
</template>

<style scoped>
header {
  padding: 2rem;
}
input {
  border: 1px solid #c2c2c2;
  padding: 0.7rem;
}
.input-email {
  border-right: transparent;
}
.btn {
  background-color: #ffbc00;
  margin-top: 1rem;
}
form {
  margin-top: 3rem;
}
</style>
