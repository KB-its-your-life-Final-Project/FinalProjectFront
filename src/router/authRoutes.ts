import type { RouteRecordRaw } from "vue-router";

const authRoutes: RouteRecordRaw[] = [
  {
    path: "/auth",
    // component: () => import('뷰파일.vue'),
    children: [
      {
        path: "login",      // /auth/login
        name: "login",
        component: () => import("@/pages/auth/LoginIntroPage.vue"),
        children: [
          {
            path: "email",  // /auth/login/email
            name: "loginEmail",
            component: () => import("@/pages/auth/LoginEmailPage.vue"),
          },
          {
            path: "kakao",  // /auth/login/kakao
            name: "loginKakao",
            component: () => import("@/pages/auth/LoginKakaoPage.vue"),
          },
        ]
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
