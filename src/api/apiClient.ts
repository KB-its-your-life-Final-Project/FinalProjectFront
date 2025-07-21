import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  AxiosError,
} from "axios";
// import { useAuthStore } from '@/stores/authStore';
import router from "@/router";

// axios객체 생성 (프로젝트 전체에서 사용할 객체)
// request/response 인터셉터 설정이 된 axios객체를 사용하기 위함
const instance: AxiosInstance = axios.create({
  timeout: 1000,
});

// // Request 인터셉터
// instance.interceptors.request.use(
//   (config: AxiosRequestConfig): AxiosRequestConfig => {
//     const { getToken } = useAuthStore();
//     const token = getToken();
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//       console.log('전송될 jwt>> ' + config.headers.Authorization);
//     }
//     return config;
//   },
//   (error: any): Promise<never>=> {
//     return Promise.reject(error);
//   }
// );

// // Response 인터셉터
// instance.interceptors.response.use(
//   (response: AxiosResponse): AxiosResponse => {
//     if (response.status === 200) {
//       return response;
//     }
//     if (response.status === 404) {
//       return Promise.reject('404: 페이지 없음 ' + response.request);
//     }
//     return response;
//   },
//   async (error: AxiosError): Promise<never> => {
//     if (error.response?.status === 401) {
//       const { logout } = useAuthStore();
//       logout();
//       router.push('/auth/login?error=login_required');
//       return Promise.reject({ error: '로그인이 필요한 서비스입니다.' });
//     }
//     return Promise.reject(error);
//   }
// );
 export default instance
