import { defineStore } from "pinia";
import { computed, reactive } from "vue";
import { Api } from "@/api/autoLoad/Api";
import type { LoginRequestDTO, ApiResponseMemberResponseDTO } from "@/api/autoLoad/data-contracts";
import { useToast } from "@/utils/useToast";

const api = new Api();
const { addToast, createToast } = useToast();

/** 사용자 정보 인터페이스 */
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

/** 기본 사용자 초기값 */
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

/** 인증 관련 상태 및 메서드 관리 Pinia 스토어 */
export const authStore = defineStore("auth", () => {
  /** 현재 로그인한 사용자 상태 */
  const member = reactive<Member>(getDefaultMember());

  /** 로그인 여부 계산 (id가 존재하고 이메일/Kakao/Google 아이디 중 하나라도 있는 경우) */
  const isLoggedIn = computed(() => {
    return member.id !== 0 && (member.email || member.kakaoId || member.googleId);
  });

  /**
   * 이메일 중복 확인
   * @param email 확인할 이메일
   * @returns 중복 여부
   */
  const checkDuplicateEmail = async (email: string): Promise<boolean> => {
    try {
      const { data } = await api.checkDuplicateEmailUsingGet(email);
      return data.data ?? false;
    } catch (error: unknown) {
      console.error("이메일 중복 확인 오류:", error);
      throw error;
    }
  };

  /**
   * 로그인 상태 확인
   * @returns 로그인 여부
   */
  const checkLoginStatus = async (): Promise<boolean> => {
    try {
      const { data } = await api.checkLoginStatusUsingGet();
      if (!data || !data.success || !data.data) return false;
      return true;
    } catch (error: unknown) {
      console.error("로그인 상태 확인 오류:", error);
      return false;
    }
  };

  /**
   * 로그인 수행 (토큰은 쿠키 기반)
   * @param loginInfo 로그인 요청 DTO
   * @returns 로그인 API 응답
   */
  const login = async (loginInfo: LoginRequestDTO): Promise<ApiResponseMemberResponseDTO> => {
    try {
      const { data } = await api.loginUsingPost(loginInfo);

      if (data.success === false && data.code === 1013) return data;

      if (data.success === true && data.data) {
        // 상태 업데이트
        Object.assign(member, data.data);

        // 로컬 스토리지에 회원 정보 저장
        localStorage.setItem("authUser", JSON.stringify(data.data));

        // 로그인 방식 확인
        const createdType = data.data.createdType;
        if (createdType === 1) console.log("이메일 로그인 성공");
        else if (createdType === 2) console.log("카카오 로그인 성공");
        else if (createdType === 3) console.log("구글 로그인 성공");
        else console.log("알 수 없는 로그인 방식");

        return data;
      }

      throw new Error(data.message || "로그인 실패");
    } catch (error: unknown) {
      throw error;
    }
  };

  /**
   * 로그아웃 수행
   * - 서버 로그아웃 API 호출
   * - 로컬 상태 초기화 및 토스트 메시지
   */
  const logout = async (): Promise<void> => {
    try {
      await api.logoutUsingPost();
      addToast(createToast("로그아웃 되었습니다", "success"));
    } catch (error: unknown) {
      console.error("로그아웃 실패:", error);
    } finally {
      localStorage.removeItem("authUser");
      Object.assign(member, getDefaultMember());
    }
  };

  /**
   * 사용자 상태 직접 설정
   * @param newMember Partial<Member> 업데이트할 회원 정보
   */
  const setMember = (newMember: Partial<Member>): void => {
    Object.assign(member, newMember);
    localStorage.setItem("authUser", JSON.stringify(member));
  };

  /**
   * 로컬 스토리지에서 사용자 정보 로드
   * - 페이지 새로고침 시 로그인 상태 유지용
   */
  const load = (): void => {
    const storedMember = localStorage.getItem("authUser");
    if (storedMember) {
      try {
        const parsed: Member = JSON.parse(storedMember);
        Object.assign(member, parsed);
      } catch (error: unknown) {
        console.error("로컬스토리지 JSON 파싱 실패:", error);
        localStorage.removeItem("authUser");
      }
    }
  };

  load(); // 스토어 초기화 시 로컬 스토리지에서 상태 복원

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
