import type { RouteRecordRaw } from "vue-router";

const authRoutes: RouteRecordRaw[] = [
  {
    path: "/auth",
    // component: () => import('뷰파일.vue'),
    children: [
      {
        path: "/auth/login",
        name: "login",
        component: () => import("@/pages/auth/LoginPage.vue"),
      },
      {
        path: "/auth/register",
        name: "register",
        component: () => import("@/pages/auth/RegisterPage.vue"),
      },
      {
        path: "/auth/changepassword",
        name: "changepassword",
        component: () => import("@/pages/auth/ChangePasswordPage.vue"),
      },
    ],
  },
];

export default authRoutes;
