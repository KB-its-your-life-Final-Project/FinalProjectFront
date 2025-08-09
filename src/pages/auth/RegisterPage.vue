<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { authStore } from "@/stores/authStore.ts";
import { Api } from "@/api/autoLoad/Api";
import { isEmpty, isValidEmailFormat, isValidPasswordFormat, isValidPasswordChk, isValidName } from "@/utils/validate";
import GoBackBtn from "@/components/common/GoBackBtn.vue";
import { useToast } from "@/utils/useToast";

const router = useRouter();
const auth = authStore();
const api = new Api();
const { addToast, createToast } = useToast();

// const emailChecked = ref<string>("");
// const disableSend = ref<boolean>(true);
const checkEmailMsg = ref<string>("");
const checkNamelMsg = ref<string>("");
const checkPwdMsg = ref<string>("");
const checkPwdChkMsg = ref<string>("");
const checkSubmitMsg = ref<string>("");

interface MemberRegisterForm {
  email: string;
  name: string;
  // verificationCode: string;
  pwd: string;
  pwdChk: string;
}

const member = reactive<MemberRegisterForm>({
  email: "",
  name: "",
  // verificationCode: "",
  pwd: "",
  pwdChk: "",
});

// const sendCode = async () => {
//   checkSubmitMsg.value = "";
//   if (isEmpty(member.email)) {
//     disableSend.value = true;
//     checkEmailMsg.value = "이메일을 입력하세요";
//     return;
//   }
//   if (!isValidEmailFormat(member.email)) {
//     disableSend.value = true;
//     checkEmailMsg.value = "올바른 형식의 이메일을 입력하세요";
//     return;
//   }
//   const isDuplicateEmail: boolean = await auth.checkDuplicateEmail(member.email);
//   if (isDuplicateEmail) {
//     disableSend.value = true;
//     checkEmailMsg.value = "사용중인 이메일입니다";
//     return;
//   }
//   // 인증코드 전송
//   emailChecked.value = member.email;
//   console.log("checked", member.email);
//   const { data } = await api.sendVerificationCodeUsingPost(member.email);
//   console.log("data", data);
//   disableSend.value = false;
//   checkEmailMsg.value = "인증번호를 발송했습니다";
//   return;
// };

const handleRegister = async () => {
  checkEmailMsg.value = "";
  checkNamelMsg.value = "";
  checkPwdMsg.value = "";
  checkPwdChkMsg.value = "";
  checkSubmitMsg.value = "";

  // 이메일 검사
  if (isEmpty(member.email)) {
    checkEmailMsg.value = "이메일을 입력하세요";
  } else if (!isValidEmailFormat(member.email)) {
    checkEmailMsg.value = "올바른 형식의 이메일을 입력하세요";
  } else {
    const isDuplicateEmail: boolean = await auth.checkDuplicateEmail(member.email);
    if (isDuplicateEmail) {
      checkEmailMsg.value = "사용중인 이메일입니다";
    }
  }
  // if (isEmpty(member.verificationCode)) {
  //   checkSubmitMsg.value = "올바른 인증번호를 입력하세요";
  //   return;
  // }
  // const isVerifiedCode = await api.verifyCodeUsingPost(member.email, member.verificationCode);
  // if (isVerifiedCode?.data) {
  //   checkSubmitMsg.value = "인증번호가 일치하지 않습니다";
  //   return;
  // }

  // 이름 검사
  if (isEmpty(member.name)) {
    checkNamelMsg.value = "이름을 입력하세요";
  } else if (!isValidName(member.name)) {
    checkNamelMsg.value = "올바른 형식의 이름을 입력하세요";
  }

  // 비밀번호 검사
  if (isEmpty(member.pwd)) {
    checkPwdMsg.value = "비밀번호를 입력하세요";
  } else if (!isValidPasswordFormat(member.pwd)) {
    checkPwdMsg.value = "올바른 형식의 비밀번호를 입력하세요"
  }

  // 비밀번호 확인 검사
  if (isEmpty(member.pwdChk)) {
    checkPwdChkMsg.value = "비밀번호를 입력하세요";
  } else if (!isValidPasswordChk(member.pwd, member.pwdChk)) {
    checkPwdChkMsg.value = "비밀번호가 일치하지 않습니다";
  }

  // 입력값 오류 여부 확인
  const hasError = [
    checkEmailMsg.value,
    checkNamelMsg.value,
    checkPwdMsg.value,
    checkPwdChkMsg.value
  ].some(msg => msg !== "");
  if (hasError) {
    addToast(createToast("입력값을 확인하세요.", "error", 2000));
    return;
  }

  // 모든 검증 통과 → 회원가입
  try {
    const response = await api.registerByEmailUsingPost(member);
    console.log("response: ", response);
    localStorage.setItem("savedEmail", member.email);
    addToast(createToast("회원가입 완료", "success", 2000));
    router.push({ name: "loginEmail" });
  } catch (e) {
    addToast(createToast("서버 오류: 회웝가입에 실패했습니다. 잠시 후 시도해주세요.", "error", 2000));
    console.error(e);
  }
};
</script>

<template>
  <header class="header-wrapper">
    <GoBackBtn />
    <h1 class="text-2xl font-pretendard-bold">회원가입</h1>
  </header>
  <div class="flex flex-col items-center">
    <form class="form" method="post" @submit.prevent="handleRegister" novalidate>
      <!-- <div>
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
        <input
          class="input-box"
          type="text"
          placeholder="인증번호를 입력하세요"
          v-model="member.verificationCode"
        />
      </div> -->
      <div>
        <label for="email">이메일 주소</label>
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
        <label for="name">이름</label>
        <input
          class="input-box"
          type="text"
          placeholder="이름을 입력하세요"
          v-model="member.name"
        />
        <p class="error-msg">
          {{ checkNamelMsg }}
        </p>
      </div>
      <div>
        <label for="pwd">비밀번호</label>
        <span class="guide-msg"> *영문 대·소문자, 숫자, 특수문자를 각각 포함한 8자 이상 </span>
        <input
          class="input-box"
          type="password"
          placeholder="비밀번호를 입력하세요"
          id="pwd"
          v-model="member.pwd"
        />
        <p class="error-msg">
          {{ checkPwdMsg }}
        </p>
      </div>
      <div>
        <label for="pwdChk">비밀번호 확인</label>
        <input
          class="input-box"
          type="password"
          placeholder="비밀번호 확인"
          id="pwdChk"
          v-model="member.pwdChk"
        />
        <p class="error-msg">
          {{ checkPwdChkMsg }}
        </p>
      </div>
      <button class="btn-form" type="submit">회원가입</button>
    </form>
  </div>
</template>

<style scoped>
@reference "@/assets/styles/main.css";

.header-wrapper {
  @apply p-[1rem] bg-kb-yellow w-full h-[6rem] flex items-center gap-2;
}
.form {
  @apply mt-[3rem] w-5/6 h-auto flex flex-col gap-1;
}
.input-box {
  @apply p-[0.7rem] border-[1px] border-solid border-kb-ui-07 w-full h-11 rounded-md;
}
.input-email {
  @apply p-[0.7rem] border-[1px] border-solid border-kb-ui-07 flex-grow rounded-l-md h-11 min-w-0;
}
.guide-msg {
  @apply ml-2 h-2 text-kb-ui-06 text-[0.7rem];
}
.error-msg {
  @apply w-full h-0 text-left text-error/60 mb-7 pt-1 pl-2;
}
/* .btn {
  @apply h-11 bg-kb-yellow-positive text-white whitespace-nowrap cursor-pointer;
} */
.btn-form {
  @apply mt-5 bg-kb-yellow-positive w-full h-12 rounded-xl text-white whitespace-nowrap cursor-pointer;
}
</style>
