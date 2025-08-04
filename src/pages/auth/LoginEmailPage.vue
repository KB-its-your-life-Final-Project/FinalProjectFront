<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import type { AxiosError } from "axios";
import movePage from "@/utils/movePage";
import { authStore } from "@/stores/authStore.ts";
import GoBackBtn from "@/components/common/GoBackBtn.vue";
import RegisterLink from "@/components/common/RegisterLink.vue";
import { isEmpty, isValidEmailFormat } from "@/utils/validate";
import type { LoginDTO } from "@/api/autoLoad/data-contracts";

const auth = authStore();

const member = reactive<LoginDTO>({
  email: "",
  password: "",
  code: "",
  createdType: 1,
});

const checkSubmitMsg = ref<string>("");

onMounted(() => {
  const savedEmail = localStorage.getItem("savedEmail");
  if (savedEmail) {
    member.email = savedEmail;
  }
});

const login = async () => {
  checkSubmitMsg.value = "";
  localStorage.setItem("savedEmail", member.email);
  console.log("사용자 input: ", member);
  if (isEmpty(member.email)) {
    checkSubmitMsg.value = "이메일을 입력하세요";
    return;
  }
  if (!isValidEmailFormat(member.email)) {
    checkSubmitMsg.value = "올바른 형식의 이메일을 입력하세요";
    return;
  }
  const isDuplicateEmail: boolean = await auth.checkDuplicateEmail(member.email);
  console.log("isDuplicateEmail: ", isDuplicateEmail);
  if (!isDuplicateEmail) {
    checkSubmitMsg.value = "등록되지 않은 이메일입니다";
    return;
  }
  if (isEmpty(member.password)) {
    checkSubmitMsg.value = "비밀번호를 입력하세요";
    return;
  }
  try {
    const response = await auth.login(member);
    console.log("로그인 성공");
    console.log("response", response);
    movePage.homeMain();
  } catch (error) {
    const err = error as AxiosError;
    checkSubmitMsg.value = "비밀번호가 일치하지 않습니다";
    console.error("로그인 에러:", err);
  }
};
</script>

<template>
  <header class="p-[1rem] bg-kb-yellow w-full h-[6rem] flex items-center gap-2">
    <GoBackBtn />
    <h1 class="text-2xl font-pretendard-bold">로그인</h1>
  </header>
  <div class="content-wrapper">
    <form class="form" method="post" @submit.prevent="login" novalidate>
      <div>
        <label for="username">이메일 주소</label>
        <input
          class="input-box"
          type="email"
          placeholder="이메일을 입력하세요"
          v-model="member.email"
        />
      </div>
      <div>
        <label for="password">비밀번호</label>
        <input
          class="input-box"
          type="password"
          placeholder="비밀번호를 입력하세요"
          v-model="member.password"
        />
      </div>
      <p class="w-full h-2 text-center text-error">
        {{ checkSubmitMsg }}
      </p>
      <button class="btn" type="submit">로그인</button>
    </form>
    <RegisterLink />
  </div>
</template>

<style scoped>
@reference "@/assets/styles/main.css";

.content-wrapper {
  @apply flex flex-col items-center;
}
.form {
  @apply mt-[3rem] w-5/6 h-auto flex flex-col gap-7;
}
.input-box {
  @apply p-[0.7rem] border-[1px] border-solid border-kb-ui-07 w-full h-11 rounded-md;
}
.btn {
  @apply mt-[0rem] bg-kb-yellow-positive w-full h-12 rounded-xl text-white whitespace-nowrap cursor-pointer;
}
</style>
