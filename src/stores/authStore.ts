import { defineStore } from "pinia";
import { ref, computed } from "vue";
import apiClient from "@/api/apiClient";

interface User {
  email: string;
  roles: string[];
}

interface AuthState {
  user: User;
}

interface Member {
  email: string;
  password: string;
}

const initState: AuthState = {
  user: {
    email: "",
    roles: [],
  },
};

export const authStore = defineStore("auth", () => {
  const state = ref<AuthState>({ ...initState });

  const isLoggedIn = computed(() => !!state.value.user.email); // 로그인 여부

  const getUsername = computed(() => state.value.user.email); // 로그인 사용자 ID

  // 로그인 (토큰은 쿠키에 있으므로 응답에서 사용자 정보만 받아서 상태에 저장)
  const loginUser = async (member: Member): Promise<void> => {
    try {
      const { data } = await apiClient.post<User>("/api/auth/login", member, { withCredentials: true });
      state.value.user = data;
      localStorage.setItem("authUser", JSON.stringify(data));  // 사용자 정보만 저장
    } catch (error) {
      throw error;
    }
  };

  // 로그아웃
  // const logoutUser = async (): Promise<void> => {
  //   try {
  //     await apiClient.post("/api/auth/logout", null, { withCredentials: true });
  //   } finally {
  //     localStorage.removeItem("authUser");
  //     state.value = { ...initState };
  //   }
  // };

  // 로컬 스토리지에서 사용자 정보 로드 (페이지 새로고침 시 유지용)
  const load = (): void => {
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      state.value.user = JSON.parse(storedUser);
    }
  };
  load();

  // 사용자 정보 업데이트
  // const changeProfile = (member: Partial<User>): void => {
  //   if (member.email) {
  //     state.value.user.email = member.email;
  //     localStorage.setItem("authUser", JSON.stringify(state.value.user));
  //   }
  // };

  return {
    state,
    isLoggedIn,
    getUsername,
    loginUser,
    // logoutUser,
    // changeProfile,
  };
});
