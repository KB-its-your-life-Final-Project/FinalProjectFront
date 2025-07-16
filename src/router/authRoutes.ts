import type { RouteRecordRaw } from "vue-router";

const authRoutes: RouteRecordRaw[] = [
  {
    path: "/auth",
    // component: () => import('뷰파일.vue'),
    children: [
      {
        path: "loginintro",
        name: "loginIntro",
        component: () => import("@/pages/auth/LoginIntroPage.vue"),
      },
      {
        path: "loginemail",
        name: "loginEmail",
        component: () => import("@/pages/auth/LoginEmailPage.vue"),
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
