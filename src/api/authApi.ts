import apiClient from "@/api/apiClient";

const BASE_URL = "/api/member";
const headers = { headers: { "Content-Type": "multipart/form-data" } };

export interface Member {
  email: string;
  verificationCode: string;
  name: string;
  password1: string;
}

export default {
  // 이메일 중복 확인
  async checkDuplicateEmail(email: string): Promise<boolean> {
    const { data } = await apiClient.get<boolean>(`${BASE_URL}/checkemail/${email}`);
    console.log("AUTH GET CHECKEMAIL", data === false ? "이메일 사용 가능" : "이메일 사용 불가");
    return data;
  },

  // 이메일 회원가입
  async registerUser(member: Member): Promise<any> {
    const formData = new FormData();
    formData.append("email", member.email);
    formData.append("verificationCode", member.verificationCode);
    formData.append("name", member.name);
    formData.append("password", member.password1);
    console.log("formData - email: ", formData.get("email"));
    console.log("formData - name: ", formData.get("name"));
    console.log("formData - password: ", formData.get("password"));
    try {
      const { data } = await apiClient.post(`${BASE_URL}/register/email`, formData, headers);
      console.log("AUTH POST (registerUser): ", data);
      return data;
    } catch (error: any) {
      console.error("회원가입 실패: ", error);
      console.error("response: ", error.response?.data);
      console.error("status code:", error.response?.status);
    }
  },

  // 카카오 로그인
  async kakaoLogin(code: string): Promise<any> {
    try {
      const { data } = await apiClient.post(
        `${BASE_URL}/register/kakao`,
        { code },
        { withCredentials: true },
      );
      console.log("AUTH POST (kakaoLogin): ", data);
      return data;
    } catch (error: any) {
      console.error("카카오 로그인 실패: ", error);
      console.error("response: ", error.response?.data);
      console.error("status code:", error.response?.status);
    }
  },
};
