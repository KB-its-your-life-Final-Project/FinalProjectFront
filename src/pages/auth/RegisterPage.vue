<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import authApi from "@/api/authApi";

const router = useRouter();
const checkError = ref<string>("");

interface MemberRegisterForm {
  email: string;
  name: string;
  password1: string;
  password2: string;
}

const member = reactive<MemberRegisterForm>({
  email: "",
  name: "",
  password1: "",
  password2: "",
});

const disableSubmit = ref<boolean>(true);

const checkEmail = async () => {
  if (!member.email) {
    alert("이메일을 입력하세요");
    return;
  }

  const isDuplicate: boolean = await authApi.checkEmail(member.email);
  disableSubmit.value = isDuplicate;
  checkError.value = isDuplicate ? "이미 사용중인 이메일입니다" : "사용 가능한 이메일입니다";
};

const registerUser = async () => {
  checkEmail();
  if (!member.name) {
    alert("이름을 입력하세요");
    return;
  }
  if (!member.password1 || !member.password2) {
    alert("비밀번호를 입력하세요");
    return;
  }
  if (member.password1 !== member.password2) {
    alert("비밀번호가 일치하지 않습니다");
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
    <form @submit.prevent="registerUser" method="post" class="w-5/6 h-auto flex flex-col gap-5">
      <div>
        <label for="email">이메일 주소</label>
        <div class="flex flex-row w-full h-auto">
          <input
            class="input-email flex-grow rounded-l-md h-11 min-w-0"
            type="email"
            placeholder="이메일을 입력하세요"
            v-model="member.email"
          />
          <button
            class="btn rounded-r-md w-24 h-11 text-white whitespace-nowrap"
            @click="checkEmail"
            type="button"
          >
            인증
          </button>
        </div>
      </div>
      <div>
        <label for="verification-code">인증 번호</label>
        <input class="w-full h-11 rounded-md" type="text" placeholder="인증번호를 입력하세요" />
      </div>
      <div>
        <label for="name">이름</label>
        <input class="w-full h-11 rounded-md" type="text" placeholder="이름을 입력하세요" v-model="member.name"/>
      </div>
      <div>
        <label for="password">비밀번호</label>
        <input
          class="w-full h-11 rounded-md"
          type="password"
          placeholder="비밀번호를 입력하세요"
          id="password1"
          v-model="member.password1"
        />
      </div>
      <div>
        <label for="password">비밀번호 확인</label>
        <input
          class="w-full h-11 rounded-md"
          type="password"
          placeholder="비밀번호 확인"
          id="password2"
          v-model="member.password2"
        />
      </div>
      <span :class="disableSubmit.valueOf() ? 'text-error' : 'text-kb-yellow-positive'">
        {{ checkError }}
      </span>
      <button
        class="btn btn__form w-full h-12 rounded-xl text-white"
        type="submit"
        :disabled="disableSubmit"
      >
        회원가입
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
}
.btn__form {
  margin-top: 5rem;
}
form {
  margin-top: 3rem;
}
</style>
