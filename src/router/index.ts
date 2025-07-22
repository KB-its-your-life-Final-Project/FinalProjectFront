import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import { authRouteRecordRaw } from "@/router/authRoute";
import { myPageRouteRecordRaw } from "@/router/mypageRoutes";
import { mainRouteRecordRaw } from "@/router/mainRoute";

const routes: RouteRecordRaw[] = [
  //메인 라우트
  ...mainRouteRecordRaw,
  ...authRouteRecordRaw, // 인증 관련 화면 라우트 연결
  ...myPageRouteRecordRaw, // 마이페이지 관련 화면 라우트 연결
  // ...대메뉴1Routes,
  // ...대메뉴2Routes,

  // Splash Screen
  {
    path: "/",
    name: "splashScreen",
    component: () => import("@/components/layout/SplashScreenPage.vue"),
  },
  // 404 NotFound
  {
    path: "/:paths(.*)*",
    name: "NotFound",
    component: () => import("@/components/layout/NotFoundPage.vue"),
  },
  // 테스트 화면
  {
    path: "/test",
    name: "test",
    component: () => import("@/pages/TestPage.vue"),
  },
];

// router 객체 생성
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
