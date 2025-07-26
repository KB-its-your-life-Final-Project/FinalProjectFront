import type { RouteRecordRaw } from "vue-router";

//라우트 파일 위치
const authRouteMap: Record<string, () => Promise<any>> = {
  // 로그인 안내
  login: () => import("@/pages/auth/LoginIntroPage.vue"),

  // 이메일 로그인
  loginEmail: () => import("@/pages/auth/LoginEmailPage.vue"),

  //카카오 로그인
  loginKakao: () => import("@/pages/auth/LoginKakaoPage.vue"),

  //구글 로그인
  loginGoogle: () => import("@/pages/auth/LoginGooglePage.vue"),

  // 회원가입
  register: () => import("@/pages/auth/RegisterPage.vue"),
};

//라우트 이름
const authRouteName = {
  login: "login",
  loginEmail: "loginEmail",
  loginKakao: "loginKakao",
  loginGoogle: "loginGoogle",
  register: "register",
};

//라우트 설정
const authRouteRecordRaw: RouteRecordRaw[] = [
  {
    path: "/auth",
    children: [
      {
        path: "login",
        name: authRouteName.login,
        component: authRouteMap.login,
      },
      {
        path: "loginEmail",
        name: authRouteName.loginEmail,
        component: authRouteMap.loginEmail,
      },
      {
        path: "loginKakao",
        name: authRouteName.loginKakao,
        component: authRouteMap.loginKakao,
      },
      {
        path: "loginGoogle",
        name: authRouteName.loginGoogle,
        component: authRouteMap.loginGoogle,
      },
      {
        path: "register",
        name: authRouteName.register,
        component: authRouteMap.register,
      },
    ],
  },
];

export { authRouteMap, authRouteName, authRouteRecordRaw };
