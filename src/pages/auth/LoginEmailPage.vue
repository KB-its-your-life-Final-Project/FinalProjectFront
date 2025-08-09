<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import movePage from "@/utils/movePage";
import { authStore } from "@/stores/authStore.ts";
import GoBackBtn from "@/components/common/GoBackBtn.vue";
import RegisterLink from "@/components/common/RegisterLink.vue";
import { isEmpty, isValidEmailFormat } from "@/utils/validate";
import type { LoginRequestDTO } from "@/api/autoLoad/data-contracts";
import { useToast } from "@/utils/useToast";

const auth = authStore();
const { addToast, createToast } = useToast();

const member = reactive<LoginRequestDTO>({
  email: "",
  pwd: "",
  code: "",
  createdType: 1,
});

const checkEmailMsg = ref<string>("");
const checkPwdMsg = ref<string>("");

onMounted(() => {
  const savedEmail = localStorage.getItem("savedEmail");
  if (savedEmail) {
    member.email = savedEmail;
  } else {
    console.log("저장된 이메일이 없습니다.");
  }
});

const handleLogin = async () => {
  checkEmailMsg.value = "";
  checkPwdMsg.value = "";

 // 이메일 검사
 if (isEmpty(member.email)) {
    checkEmailMsg.value = "이메일을 입력하세요";
  } else if (!isValidEmailFormat(member.email)) {
    checkEmailMsg.value = "올바른 형식의 이메일을 입력하세요";
  }
  const isDuplicateEmail: boolean = await auth.checkDuplicateEmail(member.email);
  if (!isDuplicateEmail) {
    checkEmailMsg.value = "등록되지 않은 이메일입니다";
  }

  // 비밀번호 검사
  if (isEmpty(member.pwd)) {
    checkPwdMsg.value = "비밀번호를 입력하세요";
    return;
  }
  try {
    const response = await auth.login(member);
    if (response.success === false && response.code === 1013) {
      console.log("로그인 결과: ", response.message);
      checkPwdMsg.value = "비밀번호가 일치하지 않습니다";
      return;
    }

    // 회원 인증 성공
    localStorage.setItem("savedEmail", member.email);
    addToast(createToast("로그인 성공", "success", 2000));
    movePage.homeMain();
  } catch (e) {
    console.error(e);
  }
};
</script>

<template>
  <header class="p-[1rem] bg-kb-yellow w-full h-[6rem] flex items-center gap-2">
    <GoBackBtn />
    <h1 class="text-2xl font-pretendard-bold">로그인</h1>
  </header>
  <div class="content-wrapper">
    <form class="form" method="post" @submit.prevent="handleLogin" novalidate>
      <div>
        <label for="username">이메일 주소</label>
        <input
          class="input-box"
          type="email"
          placeholder="이메일을 입력하세요"
          v-model="member.email"
        />
        <p class="error-msg">
          {{ checkEmailMsg }}
        </p>
      </div>
      <div>
        <label for="password">비밀번호</label>
        <input
          class="input-box"
          type="password"
          placeholder="비밀번호를 입력하세요"
          v-model="member.pwd"
        />
        <p class="error-msg">
          {{ checkPwdMsg }}
        </p>
      </div>
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
  @apply mt-[3rem] w-5/6 h-auto flex flex-col gap-1;
}
.input-box {
  @apply p-[0.7rem] border-[1px] border-solid border-kb-ui-07 w-full h-11 rounded-md;
}
.error-msg {
  @apply w-full h-0 text-left text-error/60 mb-7 pt-1 pl-2;
}
.btn {
  @apply mt-5 bg-kb-yellow-positive w-full h-12 rounded-xl text-white whitespace-nowrap cursor-pointer;
}
</style>
