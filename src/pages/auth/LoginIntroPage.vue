<script setup lang="ts">
import { onMounted } from "vue";
import RegisterLink from "@/components/common/RegisterLink.vue";
import movePage from "@/utils/movePage";

onMounted(() => {
  const kakao = (window as any).Kakao;
  if (kakao && !kakao.isInitialized()) {
    kakao.init(import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY);
    console.log("Kakao SDK가 초기화되었습니다");
  } else if (kakao) {
    console.log("Kakao SDK가 이미 로드되었습니다");
  } else {
    console.warn("Kakao SDK를 찾을 수 없습니다");
  }
});

const loginKakao = async () => {
  const REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
  const REDIRECT_URI = encodeURIComponent(import.meta.env.VITE_KAKAO_REDIRECT_URI);
  // prompt=consent 동의 화면 강제 호출
  console.log("REST_API_KEY", REST_API_KEY);
  console.log("REDIRECT_URI", REDIRECT_URI);
  const AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code&prompt=consent`;
  window.location.href = AUTH_URL;
};

const loginGoogle = async () => {
  const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const REDIRECT_URI = encodeURIComponent(import.meta.env.VITE_GOOGLE_REDIRECT_URI);
  const SCOPE = encodeURIComponent(
    "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
  );
  const STATE = "xyz"; // CSRF 방지용
  const AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPE}&state=${STATE}&access_type=offline&prompt=consent`;
  window.location.href = AUTH_URL;
};
</script>

<template>
  <div class="wrapper">
    <!-- 로고 및 문구 영역 -->
    <div class="logo-content-wrapper">
      <h1 class="w-50">
        <img class="w-full" src="@/assets/imgs/logo.svg" alt="로고" />
      </h1>
      <h2 class="h2-wrapper">
        <div>로그인하시고</div>
        <div>안전한 방을 찾으세요!</div>
      </h2>
    </div>
    <!-- // 로고 및 문구 영역 -->
    <!-- 로그인 버튼 및 회원가입 영역 -->
    <div class="login-register-wrapper">
      <!-- 로그인 버튼 영역 -->
      <div class="login-btn-wrapper">
        <button class="login-btn kakao-sec" @click="loginKakao">
          <div class="snslogo-text-wrapper">
            <img class="size-5" src="@/assets/imgs/kakao.svg" alt="카카오 로고" />
            <span>카카오톡으로 시작하기</span>
          </div>
        </button>
        <button class="login-btn google-sec" @click="loginGoogle">
          <div class="snslogo-text-wrapper">
            <img class="size-5" src="@/assets/imgs/google.svg" alt="구글 로고" />
            <span>Google로 시작하기</span>
          </div>
        </button>
        <button class="login-btn email-sec" @click="movePage.loginEmail()">
          <div class="snslogo-text-wrapper">
            <img class="size-5" src="@/assets/imgs/email.svg" alt="이메일 이미지" />
            <span>E-mail로 시작하기</span>
          </div>
        </button>
      </div>
      <!-- // 로그인 버튼 영역 -->
      <!-- 회원가입 영역 -->
      <RegisterLink />
      <!-- // 회원가입 영역 -->
    </div>
    <!-- // 로그인 버튼 및 회원가입 영역 -->
  </div>
</template>

<style scoped>
@reference "@/assets/styles/main.css";

.wrapper {
  @apply flex flex-col items-center justify-center min-h-screen gap-20;
}
.logo-content-wrapper {
  @apply flex flex-col items-center gap-5;
}
.h2-wrapper {
  @apply flex flex-col items-center text-3xl font-pretendard-bold gap-2;
}
.login-register-wrapper {
  @apply flex flex-col items-center w-full gap-8;
}
.login-btn-wrapper {
  @apply flex flex-col items-center w-5/6 h-auto gap-3;
}
.snslogo-text-wrapper {
  @apply flex flex-row items-center gap-3;
}
.login-btn {
  @apply w-full h-14 flex justify-center rounded-xl cursor-pointer transition-all duration-300 ease-in-out;
}
.kakao-sec {
  @apply bg-[#fee500];
}
.google-sec {
  @apply bg-[#4285f4] text-white;
}
.email-sec {
  @apply bg-white border-[0.1rem] border-solid border-kb-ui-07;
}
.kakao-sec:hover {
  @apply bg-kb-yellow-native;
}
.google-sec:hover {
  @apply bg-[#3661a7];
}
.email-sec:hover {
  @apply bg-[#d6deeb] border-[0.1rem] border-solid;
}
</style>
