<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import authApi from "@/api/authApi";
import { isEmpty, isValidEmailFormat, isValidPasswordChk, isValidPasswordFormat } from "@/utils/validate";

const router = useRouter();

const emailChecked = ref<string>("");
const checkEmailMsg = ref<string>("");
const checkSubmitMsg = ref<string>("");
const disableSend = ref<boolean>(true);

interface MemberRegisterForm {
  email: string;
  name: string;
  verificationCode: string;
  password1: string;
  password2: string;
}

const member = reactive<MemberRegisterForm>({
  email: "",
  name: "",
  verificationCode: "",
  password1: "",
  password2: "",
});

const sendCode = async () => {
  checkSubmitMsg.value = "";
  if (isEmpty(member.email)) {
    disableSend.value = true;
    checkEmailMsg.value = "이메일을 입력하세요";
    return;
  }
  if (!isValidEmailFormat(member.email)) {
    disableSend.value = true;
    checkEmailMsg.value = "올바른 형식의 이메일을 입력하세요";
    return;
  }
  const isDuplicateEmail: boolean = await authApi.checkDuplicateEmail(member.email);
  if (isDuplicateEmail) {
    disableSend.value = true;
    checkEmailMsg.value = "사용중인 이메일입니다";
    return;
  }
  // 인증코드 전송
  emailChecked.value = member.email;
  disableSend.value = false;
  const { data } = await authApi.sendVerificationCode(member.email);
  checkEmailMsg.value = "인증번호를 발송했습니다";
  return;
};

const registerUser = async () => {
  checkEmailMsg.value = "";
  if (isEmpty(member.email) || member.email !== emailChecked.value) {
    checkSubmitMsg.value = "이메일을 인증하세요";
    return;
  }
  if (isEmpty(member.verificationCode)) {
    checkSubmitMsg.value = "올바른 인증번호를 입력하세요";
    return;
  }
  const isVerifiedCode = await authApi.verifyCode(member.email, member.verificationCode)
  if (!isVerifiedCode?.data) {
    checkSubmitMsg.value = "인증번호가 일치하지 않습니다";
    return;
  }
  if (isEmpty(member.name)) {
    checkSubmitMsg.value = "이름을 입력하세요";
    return;
  }
  if (isEmpty(member.password1) || isEmpty(member.password2)) {
    checkSubmitMsg.value = "비밀번호를 입력하세요";
    return;
  }
  if (!isValidPasswordChk(member.password1, member.password2)) {
    checkSubmitMsg.value = "비밀번호가 일치하지 않습니다";
    return;
  }
  if (!isValidPasswordFormat(member.password1)) {
    checkSubmitMsg.value = "영문 대·소문자, 숫자, 특수문자를 각각 포함한 8자 이상의 비밀번호를 입력하세요";
    return;
  }
  try {
    const response = await authApi.registerUser(member);
    console.log("response: ", response);
    localStorage.setItem("savedEmail", member.email);
    router.push({ name: "loginEmail" });
  } catch (e) {
    console.error(e);
  }
};
</script>

<template>
  <header class="bg-kb-yellow w-full h-[6rem]">
    <h1 class="text-2xl font-pretendard-bold">회원가입</h1>
  </header>
  <div class="flex flex-col items-center">
    <form class="w-5/6 h-auto flex flex-col gap-7" method="post" @submit.prevent="registerUser" novalidate>
      <div>
        <label for="email">이메일 주소</label>
        <div class="flex flex-row w-full h-auto">
          <input
            class="input-email"
            type="email"
            placeholder="이메일을 입력하세요"
            v-model="member.email"
          />
          <button class="btn rounded-r-md w-24" type="button" @click="sendCode">인증</button>
        </div>
        <p class="h-2" :class="disableSend ? 'text-error' : 'text-kb-yellow-positive'">
          {{ checkEmailMsg }}
        </p>
      </div>
      <div>
        <label for="verification-code">인증 번호</label>
        <input class="input-box" type="text" placeholder="인증번호를 입력하세요" v-model="member.verificationCode"/>
      </div>
      <div>
        <label for="name">이름</label>
        <input
          class="input-box"
          type="text"
          placeholder="이름을 입력하세요"
          v-model="member.name"
        />
      </div>
      <div>
        <label for="password1">비밀번호</label>
        <input
          class="input-box"
          type="password"
          placeholder="비밀번호를 입력하세요"
          id="password1"
          v-model="member.password1"
        />
      </div>
      <div>
        <label for="password2">비밀번호 확인</label>
        <input
          class="input-box"
          type="password"
          placeholder="비밀번호 확인"
          id="password2"
          v-model="member.password2"
        />
      </div>
      <p class="w-full h-2 text-center text-error">
        {{ checkSubmitMsg }}
      </p>
      <button class="btn btn-form w-full rounded-xl" type="submit" >
        회원가입
      </button>
    </form>
  </div>
</template>

<style scoped>
@reference "@/assets/styles/main.css";
header {
  padding: 2rem;
}
.input-box {
  @apply w-full h-11 rounded-md;
  border: 1px solid #c2c2c2;
  padding: 0.7rem;
  margin-bottom: 0.3rem;
}
.input-email {
  @apply flex-grow rounded-l-md h-11 min-w-0;
  border: 1px solid #c2c2c2;
  border-right: transparent;
  padding: 0.7rem;
  margin-bottom: 0.3rem;
}
.btn {
  @apply h-11 bg-kb-yellow-positive text-white whitespace-nowrap cursor-pointer;
}
.btn-form {
  margin-top: 1rem;
}
form {
  margin-top: 3rem;
}
</style>
