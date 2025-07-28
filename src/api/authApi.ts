import apiClient from "@/api/apiClient";

const BASE_URL = "/api/member";
const headers = { headers: { "Content-Type": "multipart/form-data" } };

export interface Member {
  email: string;
  verificationCode: string;
  name: string;
  password1: string;
}

export interface MemberEmail {
  email: string;
  password: string;
  createdType: number;
}

export default {
  /**
   * 이메일 중복 확인
   * @param email 사용자 이메일
   * @returns 이메일이 중복되었는지 여부 (true = 중복)
   */
  async checkDuplicateEmail(email: string): Promise<boolean> {
    try {
      const { data } = await apiClient.get<boolean>(`${BASE_URL}/checkemail/${email}`);
      console.log("이메일 중복 확인 응답 (authApi.checkDuplicateEmail()):", data);
      console.log(data.data === false ? "이메일 사용 가능" : "사용중인 이메일");
      return data.data;
    } catch (error: any) {
      console.error("이메일 중복 확인 실패: ", error);
      throw error;
    }
  },

  /**
   * 인증번호 전송
   * @param email 사용자 이메일
   * @returns 서버 응답
   */
  async sendVerificationCode(email: string): Promise<any> {
    try {
      const { data } = await apiClient.post(`${BASE_URL}/sendcode`, null, {
        params: { email },
      });
      console.log("인증번호 전송 응답 (authApi.sendVerificationCode()):", data);
      return data.data;
    } catch (error: any) {
      console.error("인증번호 전송 실패", error);
      throw error;
    }
  },

  /**
   * 인증번호 검증
   * @param email 사용자 이메일
   * @param verificationCode 입력된 인증번호
   * @returns 서버 으압
   */
  async verifyCode(email: string, verificationCode: string): Promise<any> {
    try {
      const { data } = await apiClient.post(`${BASE_URL}/verifycode`, null, {
        params: { email, verificationCode },
      });
      console.log("인증번호 검증 응답 (authApi.verifyCode()):", data);
      return data.data;
    } catch (error: any) {
      console.error("인증번호 검증 실패", error);
      throw error;
    }
  },

  /**
   * 이메일 회원가입
   * @param member 회원 정보(이메일, 인증번호, 이름, 비밀번호)를 담은 객체
   * @returns 서버 응답
   */
  async registerUser(member: Member): Promise<any> {
    const formData = new FormData();
    formData.append("email", member.email);
    formData.append("verificationCode", member.verificationCode);
    formData.append("name", member.name);
    formData.append("password", member.password1);
    try {
      const { data } = await apiClient.post(`${BASE_URL}/register/email`, formData, headers);
      console.log("이메일 회원가입 응답 (authApi.registerUser()): ", data);
      return data.data;
    } catch (error: any) {
      console.error("회원가입 실패: ", error);
      console.error("response: ", error.response?.data);
      console.error("status code:", error.response?.status);
    }
  },

  /**
   * 이메일 로그인
   * @param code 카카오에서 제공하는 인가 코드
   * @returns 서버 응답
   */ async loginEmail(member: MemberEmail): Promise<any> {
    try {
      const { data } = await apiClient.post(`/api/member/login`, member, { withCredentials: true });
      console.log("AUTH POST (loginEmail): ", data);
      console.log("data.success: ", data.success);
      return data;
    } catch (error: any) {
      console.error("이메일 로그인 실패: ", error);
      console.error("response: ", error.response?.data);
    }
  },

  /**
   * 카카오 회원가입/로그인
   * @param code 카카오에서 제공하는 인가 코드
   * @returns 서버 응답
   */ async kakaoLogin(code: string): Promise<any> {
    try {
      const { data } = await apiClient.post(
        `${BASE_URL}/register/kakao`,
        { code },
        { withCredentials: true },
      );
      console.log("AUTH POST (kakaoLogin): ", data);
      console.log("data.success: ", data.success);
      return data;
    } catch (error: any) {
      console.error("카카오 로그인 실패: ", error);
      console.error("response: ", error.response?.data);
    }
  },

  /**
   * 구글 회원가입/로그인
   * @param code 구글에서 제공하는 인가 코드
   * @returns 서버 응답
   */ async googleLogin(code: string): Promise<any> {
    try {
      const { data } = await apiClient.post(
        `${BASE_URL}/register/google`,
        { code },
        { withCredentials: true },
      );
      console.log("AUTH POST (googleLogin): ", data);
      console.log("data.success: ", data.success);
      return data;
    } catch (error: any) {
      console.error("구글 로그인 실패: ", error);
      console.error("response: ", error.response?.data);
    }
  },
};
