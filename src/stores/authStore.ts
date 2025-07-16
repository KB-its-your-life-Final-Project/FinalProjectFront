import { defineStore } from "pinia";
import { ref, computed } from "vue";
import apiClient from "@/api/apiClient";

interface User {
  username: string;
  email: string;
  roles: string[];
}

interface AuthState {
  token: string;
  user: User;
}

interface Member {
  username: string;
  password: string;
}

const initState: AuthState = {
  token: "",
  user: {
    username: "",
    email: "",
    roles: [],
  },
};

export const authStore = defineStore("auth", () => {
  const state = ref<AuthState>({ ...initState });

  const isLoggedIn = computed(() => !!state.value.user.username); // 로그인 여부

  const getUsername = computed(() => state.value.user.username); // 로그인 사용자 ID

  const getEmail = computed(() => state.value.user.email); // 로그인 사용자 email

  const loginUser = async (member: Member): Promise<void> => {
    // api 호출
    const { data } = await apiClient.post<AuthState>("/api/auth/login", member);
    state.value = { ...data };
    console.log(state);
    localStorage.setItem("auth", JSON.stringify(state.value));
  };

  const logoutUser = (): void => {
    localStorage.clear();
    state.value = { ...initState };
  };

  const getToken = (): string => state.value.token;

  const load = (): void => {
    const auth = localStorage.getItem("auth");
    if (auth != null) {
      state.value = JSON.parse(auth);
      console.log(state.value);
    }
  };

  load();

  const changeProfile = (member: Partial<User>): void => {
    if (member.email) {
      state.value.user.email = member.email;
      localStorage.setItem("auth", JSON.stringify(state.value));
    }
  };

  return {
    state,
    isLoggedIn,
    getUsername,
    getEmail,
    loginUser,
    logoutUser,
    getToken,
    changeProfile,
  };
});
