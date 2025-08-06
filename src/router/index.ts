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
    component: () => import("@/pages/mapSearch/MapSearch.vue"),
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
  // 인증 불필요 화면
  if (!to.meta.requiresAuth) {
    return next(); // 통과
  }
  const auth = authStore();
  try {
    // access token 유효성 확인
    await auth.checkLoginStatus();
    next();
  } catch (error: unknown) {
    // refresh token 만료 시 로그인 화면으로 이동
    console.log("refreshToken 만료: ", error);
    if (to.path !== "/auth/login") {
      next({
        path: "/auth/login",
        query: { redirect: to.fullPath },
      });
    } else {
      next(); // 자기 자신이면 그냥 통과
    }
  }
});

export default router;
