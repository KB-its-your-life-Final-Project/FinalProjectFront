<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const userEmail = ref<string>("");

onMounted(() => {
  const kakao = (window as any).Kakao;
  if (kakao && !kakao.isInitialized()) {
    kakao.init("79ef37ac2de5c500a79ac57598fc8b86");
    // kakao.init(import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY);
    console.log("Kakao SDK initialized");
  }
});

const loginKakao = async () => {
  const Kakao = (window as any).Kakao;
  if (!Kakao) {
    alert("카카오 SDK가 로드되지 않았습니다.");
    return;
  }
  if (!Kakao.Auth) {
    alert("카카오 인증 모듈이 준비되지 않았습니다.");
    return;
  }

  try {
    // 로그인
    const authObj = await new Promise<any>((resolve, reject) => {
      Kakao.Auth.login({
        success: resolve,
        fail: reject,
      });
    });

    // access token으로 사용자 정보 요청
    const profile = await new Promise<any>((resolve, reject) => {
      Kakao.API.request({
        url: "/v2/user/me",
        success: resolve,
        fail: reject,
      });
    });

    userEmail.value = profile.kakao_account?.email || "";
    console.log("사용자 이메일:", userEmail.value);

    // 백엔드로 access token과 이메일 전송해서 로그인 처리 요청
    const response = await fetch("/api/auth/kakao", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accessToken: authObj.access_token,
        email: userEmail.value
      }),
    });
    const data = await response.json();

    if (data.success) {
      router.push("/");
    } else {
      alert("로그인에 실패했습니다.");
    }
  } catch (error) {
    console.error("카카오 로그인 또는 사용자 정보 요청 실패", error);
    alert("로그인 중 오류가 발생했습니다.");
  }
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
        <button class="kakao-sec w-full h-14 flex flex-column justify-center rounded-xl" @click="loginKakao">
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
  transition: background-color 0.3s ease, color 0.3s ease;
}
</style>
