import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import { authRouteRecordRaw } from "@/router/authRoute";
import { myPageRouteRecordRaw } from "@/router/mypageRoutes";
import { mainRouteRecordRaw } from "@/router/mainRoute";
import { authStore } from "@/stores/authStore";

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
    // 지도 화면
    {
      path: "/maps",
      name: "maps",
      component: () => import("@/pages/mapSearch/MapPage.vue"),
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

// 로그인 인증 가드
router.beforeEach(async (to, from, next) => {
  if (!to.meta.requiresAuth) {
    return next(); // 통과
  }
  try {
    const auth = authStore();
    await auth.checkLogin(); // access token 유효성 확인
    next();
  } catch (error) {
    try {
      await auth.refreshTokens(); // refreshToken 시도
      next();
    } catch (error) {
      next("/auth/login"); // 로그인 화면 이동
    }
  }
});

export default router;
