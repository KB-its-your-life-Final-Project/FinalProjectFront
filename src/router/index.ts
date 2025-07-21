import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import authRoutes from "@/router/authRoutes";
import { myPageRouteRecordRaw } from "@/router/mypageRoutes";
import { mainRouteRecordRaw } from "@/router/mainRoute";

const routes: RouteRecordRaw[] = [
  //메인 라우트
  ...mainRouteRecordRaw,
  ...authRoutes, // 인증 관련 화면 라우트 연결
  ...myPageRouteRecordRaw, // 마이페이지 관련 화면 라우트 연결
  // ...대메뉴1Routes,
  // ...대메뉴2Routes,

  // 404 NotFound
  {
    path: "/:paths(.*)*",
    name: "NotFound",
    component: () => import("@/pages/NotFoundPage.vue"),
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
