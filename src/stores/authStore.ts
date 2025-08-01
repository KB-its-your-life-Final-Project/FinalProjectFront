import { defineStore } from "pinia";
import { ref } from "vue";
import { Api } from "@/api/autoLoad/Api";

const api = new Api();

// 사용자 인터페이스
interface Member {
  email: string;
  kakaoId: string;
  googleId: string;
  name: string;
  phone: string;
  profileImg: string;
  createdType: number;
}

const getDefaultMember = (): Member => ({
  email: "",
  kakaoId: "",
  googleId: "",
  name: "",
  phone: "",
  profileImg: "",
  createdType: 0,
});

export const authStore = defineStore("auth", () => {
  // 상태
  const member = ref<Member>(getDefaultMember);

  // 이메일 중복 확인
  const checkDuplicateEmail = async (email: string): Promise<boolean> => {
    try {
      const { data } = await api.checkDuplicateEmailUsingGet(email);
      console.log("checking if email is duplicate: ", data);
      if (data.success === false) {
        console.log("message: ", data.message);
        console.log("이메일 중복 여부: ", data.data);
      } else {
        console.log("message: ", data.message);
        console.log("이메일 중복 여부: ", data.data);
      }
      return data.data;
    } catch (error) {
      throw error;
    }
  };

  // 로그인 여부 확인
  const checkLoginStatus = async (): Promise<boolean> => {
    try {
      const { data } = await api.checkLoginStatusUsingGet();
      console.log("로그인 상태 확인 결과: ", data);
      if (data.success === false) {
        console.log("message: ", data.message);
        console.log("로그인 상태 여부: ", data.data);
      } else {
        console.log("message: ", data.message);
        console.log("로그인 상태 여부: ", data.data);
      }
      return data.data;
    } catch (error) {
      throw error;
    }
  };

  // 로그인 (토큰은 쿠키에 있으므로 응답에서 사용자 정보만 받아서 상태에 저장)
  const login = async (member: Member): Promise<Member> => {
    try {
      const { data } = await api.loginUsingPost(member);
      console.log("data: !!", data);
      if (data.success === true) {
        const createdType = data.data.createdType;
        localStorage.setItem("authUser", JSON.stringify(data.data)); // 사용자 정보만 저장
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
      return data.data;
    } catch (error) {
      throw error;
    }
  };

  // 로그아웃
  const logout = async (): Promise<void> => {
    try {
      await api.logoutUsingPost();
      console.log("typescript api로 로그아웃 성공!");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    } finally {
      localStorage.removeItem("authUser");
    }
  };

  // 로컬 스토리지에서 사용자 정보 로드 (페이지 새로고침 시 유지용)
  const load = (): void => {
    const storedMember = localStorage.getItem("authUser");
    try {
      if (storedMember) {
        member.value = JSON.parse(storedMember);
      }
    } catch (error) {
      console.error("Invalid JSON in localStorage:", storedMember);
      localStorage.removeItem("authUser"); // 잘못된 값 제거
    }
  };
  load();

  return {
    member,
    checkDuplicateEmail,
    checkLoginStatus,
    login,
    logout,
  };
});
