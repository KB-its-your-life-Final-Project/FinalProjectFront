import apiClient from "@/api/apiClient";

const BASE_URL = "/api/member";
const headers = { headers: { "Content-Type": "multipart/form-data" } };

export interface Member {
  username: string;
  password1: string;
  profileImg?: File;
}

export interface ChangePasswordDTO {
  username: string;
  currentPassword: string;
  newPassword: string;
}

export default {
  // id 중복 확인
  async checkUsername(username: string): Promise<boolean> {
    const { data } = await apiClient.get<boolean>(`${BASE_URL}/checkusername/${username}`);
    console.log("AUTH GET CHECKUSERNAME", data === false ? "이메일 사용 가능" : "이메일 사용 불가");
    return data;
  },

  // 사용자 생성
  async registerUser(member: Member): Promise<any> {
    const formData = new FormData();
    formData.append("username", member.username);
    formData.append("password", member.password1);
    console.log("formData: ", formData.get("username"));
    console.log("formData: ", formData.get("password"));
    const { data } = await apiClient.post(BASE_URL, formData, headers);
    console.log("AUTH POST: ", data);
    return data;
  },

  // 사용자 수정
  async updateUser(member: Member): Promise<any> {
    const formData = new FormData();
    formData.append("username", member.username);
    formData.append("password", member.password1);

    if (member.profileImg) {
      formData.append('profileImg', member.profileImg);
    }

    const {data} = await apiClient.put(`${BASE_URL}/${member.username}`, formData, headers);
    console.log('AUTH PUT: ', data);
    return data;
  },

  // 비밀번호 변경
  async changePassword(formData: ChangePasswordDTO): Promise<any> {
    const {data} = await apiClient.put(`${BASE_URL}/${formData.username}/changepassword`, formData);
    console.log(`AUTH PUT (Change Password): `, data);
    return data;
  }
}