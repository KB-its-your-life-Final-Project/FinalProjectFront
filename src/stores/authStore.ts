import { defineStore } from "pinia";
import { ref, computed } from "vue";
import authApi from "@/api/authApi";
import apiClient from "@/api/apiClient";
import { Api } from "@/api/autoLoad/Api"
import ApiResponseMemberDTO from "@/api/autoLoad/data-contracts";

const api = new Api();

interface User {
  email: string;
  kakaoId: string;
  googleId: string;
  name: string;
  phone: string;
  profileImg: string;
  createdType: number;
}

interface AuthState {
  user: User;
}

interface Member {
  email: string;
  password: string;
  code: string;
  createdType: number;
}

const initState: AuthState = {
  user: {
    email: "",
    kakaoId: "",
    googleId: "",
    name: "",
    phone: "",
    profileImg: "",
    createdType: 0,
  },
};

export const authStore = defineStore("auth", () => {
  const state = ref<AuthState>({ ...initState });

  const isLoggedIn = computed(() => !!state.value.user.email); // 로그인 여부

  const getUsername = computed(() => state.value.user.email); // 로그인 사용자 ID

  // 로그인 (토큰은 쿠키에 있으므로 응답에서 사용자 정보만 받아서 상태에 저장)
  const login = async (member: Member): Promise<void> => {
    try {
      // const response = await authApi.login(member);
      const response = await api.loginUsingPost(member);
      state.value.user = response.data;
      console.log("data: ", response.data);
      if (response.success === true) {
        const createdType = response.data.createdType;
        localStorage.setItem("authUser", JSON.stringify(response.data)); // 사용자 정보만 저장
        if (createdType === 1) {
          console.log("이메일 로그인 성공");
        } else if (createdType === 2) {
          console.log("카카오 로그인 성공");
        } else if (createdType === 3) {
          console.log("구글 로그인 성공");
        } else {
          console.log("알 수 없는 로그인 방식");
        }
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // 로그아웃
  const logout = async (): Promise<void> => {
    try {
      await apiClient.post("/api/member/logout", null, { withCredentials: true });
    } finally {
      localStorage.removeItem("authUser");
      state.value = { ...initState };
    }
  };

  // 로컬 스토리지에서 사용자 정보 로드 (페이지 새로고침 시 유지용)
  const load = (): void => {
    const storedUser = localStorage.getItem("authUser");
    try {
      if (storedUser) {
        state.value.user = JSON.parse(storedUser);
      }
    } catch (error) {
      console.error("Invalid JSON in localStorage:", storedUser);
      localStorage.removeItem("authUser"); // 잘못된 값 제거
    }
  };
  load();

  return {
    state,
    isLoggedIn,
    getUsername,
    login,
    logout,
  };
});
