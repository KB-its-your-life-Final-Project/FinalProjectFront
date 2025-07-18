import type { RouteRecordRaw } from "vue-router";

const authRoutes: RouteRecordRaw[] = [
  {
    path: "/auth",
    // component: () => import('뷰파일.vue'),
    children: [
      {
        path: "login", // /auth/login
        name: "login",
        component: () => import("@/pages/auth/LoginIntroPage.vue"),
      },
      {
        path: "loginEmail", // /auth/loginEmail
        name: "loginEmail",
        component: () => import("@/pages/auth/LoginEmailPage.vue"),
      },
      {
        path: "loginKakao", // /auth/loginKakao
        name: "loginKakao",
        component: () => import("@/pages/auth/LoginKakaoPage.vue"),
      },
      {
        path: "register",
        name: "register",
        component: () => import("@/pages/auth/RegisterPage.vue"),
      },
      {
        path: "changepassword",
        name: "changepassword",
        component: () => import("@/pages/auth/ChangePasswordPage.vue"),
      },
    ],
  },
];

export default authRoutes;
