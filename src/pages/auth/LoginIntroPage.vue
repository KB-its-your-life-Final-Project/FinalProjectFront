<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const userEmail = ref<string>("");

onMounted(() => {
  const kakao = (window as any).Kakao;
  if (kakao) {
    console.log("Kakao SDK가 로드되었습니다.");
    return;
  }
  if (!kakao.isInitialized()) {
    kakao.init(import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY);
    console.log("Kakao SDK가 초기화되었습니다.");
  }
});

const loginKakao = async () => {
  const kakao = (window as any).Kakao;
  if (kakao && !kakao.isInitialized()) {
    kakao.init(import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY);
    // kakao.init(import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY);
    console.log("Kakao SDK initialized.");
  } else {
    alert("Kakao SDK is not initialized.");
    return;
  }
  kakao.Auth.authorize({
    redirectUri: "http://localhost:5173/auth/login/kakao",
  });
};
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen gap-20">
    <!-- 로고 및 문구 영역 -->
    <div class="flex flex-col items-center gap-5">
      <h1 class="w-50"><img class="w-full" src="@/assets/imgs/logo.svg" alt="로고" /></h1>
      <h2 class="flex flex-col items-center text-3xl font-pretendard-bold">
        <div>로그인하시고</div>
        <div>안전한 방을 찾으세요!</div>
      </h2>
    </div>
    <!-- // 로고 및 문구 영역 -->
    <!-- 로그인 버튼 및 회원가입 영역 -->
    <div class="flex flex-col items-center w-full gap-8">
      <!-- 로그인 버튼 영역 -->
      <div class="flex flex-col items-center w-5/6 h-auto gap-3">
        <button
          class="kakao-sec w-full h-14 flex flex-column justify-center rounded-xl"
          @click="loginKakao"
        >
          <div class="flex flex-row items-center gap-3">
            <img class="size-5" src="@/assets/imgs/kakao.svg" alt="카카오 로고" />
            <span>카카오톡으로 시작하기</span>
          </div>
        </button>
        <button class="google-sec w-full h-14 flex flex-column justify-center rounded-xl">
          <div class="flex flex-row items-center gap-3">
            <img class="size-5" src="@/assets/imgs/google.svg" alt="구글 로고" />
            <span>Google로 시작하기</span>
          </div>
        </button>
        <button class="email-sec w-full h-14 flex flex-column justify-center rounded-xl">
          <div class="flex flex-row items-center gap-3">
            <img class="size-5" src="@/assets/imgs/email.svg" alt="이메일 이미지" />
            <router-link to="/auth/loginemail">
              <span>E-mail로 시작하기</span>
            </router-link>
          </div>
        </button>
      </div>
      <!-- // 로그인 버튼 영역 -->
      <!-- 회원가입 영역 -->
      <div>
        <div class="flex gap-3">
          <span class="text-kb-ui-04">아직 회원이 아니신가요?</span>
          <router-link to="/auth/register">
            <span class="text-positive">가입하기</span>
          </router-link>
        </div>
      </div>
      <!-- // 회원가입 영역 -->
    </div>
    <!-- // 로그인 버튼 및 회원가입 영역 -->
  </div>
</template>

<style scoped>
.google-sec {
  background-color: #4285f4;
  color: #fff;
}
.kakao-sec {
  background-color: #fee500;
}
.email-sec {
  box-sizing: border-box;
  background-color: #fff;
  border: 0.1rem solid #c2c2c2;
}
.email-sec:hover {
  background-color: #d6deeb;
  border: 0.1rem solid #d6deeb;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}
</style>
