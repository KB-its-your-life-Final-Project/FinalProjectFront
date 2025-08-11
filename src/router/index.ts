import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import { authRouteRecordRaw } from "@/router/authRoute";
import { myPageRouteRecordRaw } from "@/router/mypageRoutes";
import { mainRouteRecordRaw } from "@/router/mainRoute";
import { authStore } from "@/stores/authStore";
import { useToast } from "@/utils/useToast";
import movePage from "@/utils/movePage";

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
  const auth = authStore();
  const { createToast, addToast } = useToast();
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    // 로그인 안 했는데 접근 → 로그인 페이지로
    addToast(createToast("로그인이 필요한 서비스입니다.", "info", 2000));
    movePage.login();
  }

  if (to.meta.notLoggedIn && auth.isLoggedIn) {
    // 로그인 상태인데 접근 불가 페이지 → 홈으로
    addToast(createToast("이미 로그인 된 상태입니다.", "info", 2000));
    movePage.homeMain();
  }

  // 그 외는 통과
  next();
});

export default router;
