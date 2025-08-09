import { defineStore } from "pinia";
import { computed, reactive } from "vue";
import { Api } from "@/api/autoLoad/Api";
import type { LoginRequestDTO, MemberResponseDTO, ApiResponseMemberResponseDTO } from "@/api/autoLoad/data-contracts";
import { useToast } from "@/utils/useToast";

const api = new Api();
const { addToast, createToast } = useToast();

// 사용자 인터페이스
interface Member {
  id: number;
  email: string;
  kakaoId: string;
  googleId: string;
  name: string;
  phone: string;
  profileImg: string;
  createdType: number;
}

const getDefaultMember = (): Member => ({
  id: 0,
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
  const member = reactive<Member>(getDefaultMember());
  const isLoggedIn = computed(() => {
    return member.id !== 0 && (member.email || member.kakaoId || member.googleId);
  });
  // 이메일 중복 확인
  const checkDuplicateEmail = async (email: string): Promise<boolean> => {
    try {
      const { data } = await api.checkDuplicateEmailUsingGet(email);
      return data.data ?? false;
    } catch (error: unknown) {
      console.error("이메일 중복 확인 오류:", error);
      throw error;
    }
  };

  // 로그인 여부 확인
  const checkLoginStatus = async (): Promise<MemberResponseDTO> => {
    try {
      const { data } = await api.checkLoginStatusUsingGet();
      console.log("로그인 상태 확인 결과: ", data);
      console.log("message: ", data.message);
      console.log("로그인 상태 여부: ", data.success);

      if (!data.data) {
        throw new Error("로그인 정보가 없습니다.");
      }
      return data.data;
    } catch (error: unknown) {
      console.error("로그인 상태 확인 오류:", error);
      throw error;
    }
  };

  // 로그인 (토큰은 쿠키에 있으므로 응답에서 사용자 정보만 받아서 상태에 저장)
  const login = async (loginInfo: LoginRequestDTO): Promise<ApiResponseMemberResponseDTO> => {
    try {
      const { data } = await api.loginUsingPost(loginInfo);
      console.log("data: ", data);
      if (data.success === false && data.code === 1013) {
        console.log("error message: ", data.message)
        return data;
      }
      if (data.success === true && data.data) {
        // 상태 업데이트
        Object.assign(member, data.data);
        console.log("member: ", member);
        // 로컬 스토리지에 회원 정보 저장
        localStorage.setItem("authUser", JSON.stringify(data.data));
        const createdType = data.data.createdType;
        if (createdType === 1) {
          console.log("이메일 로그인 성공");
        } else if (createdType === 2) {
          console.log("카카오 로그인 성공");
        } else if (createdType === 3) {
          console.log("구글 로그인 성공");
        } else {
          console.log("알 수 없는 로그인 방식");
        }
        return data.data;
      }
      throw new Error(data.message || "로그인 실패");
    } catch (error: unknown) {
      throw error;
    }
  };

  // 로그아웃
  const logout = async (): Promise<void> => {
    try {
      await api.logoutUsingPost();
      addToast(createToast("로그아웃 되었습니다", "success"));
      console.log("로그아웃 성공");
    } catch (error: unknown) {
      console.error("로그아웃 실패:", error);
    } finally {
      localStorage.removeItem("authUser");
      // 상태 초기화
      Object.assign(member, getDefaultMember());
    }
  };

  // 사용자 상태 직접 설정
  const setMember = (newMember: Partial<Member>): void => {
    Object.assign(member, newMember);
    localStorage.setItem("authUser", JSON.stringify(member));
  };

  // 로컬 스토리지에서 사용자 정보 로드 (페이지 새로고침 시 유지용)
  const load = (): void => {
    const storedMember = localStorage.getItem("authUser");
    if (storedMember) {
      try {
        const parsed: Member = JSON.parse(storedMember);
        Object.assign(member, parsed);
      } catch (error: unknown) {
        console.error("로컬스토리지 JSON 파싱 실패:", error);
        localStorage.removeItem("authUser"); // 잘못된 값 제거
      }
    }
  };

  load();

  return {
    member,
    isLoggedIn,
    checkDuplicateEmail,
    checkLoginStatus,
    login,
    logout,
    setMember,
  };
});
