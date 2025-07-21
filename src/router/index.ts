import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import authRoutes from "./authRoutes";
import mypageRoutes from "./mypageRoutes";
import apiClient from "@/api/apiClient";

const routes: RouteRecordRaw[] = [
  // Splash 화면
  {
    path: "/",
    name: "splash",
    component: () => import("@/pages/SplashScreenPage.vue")
  },
  // 홈 화면
  {
    path: "/home",
    name: "home",
    component: () => import("@/pages/HomePage.vue"),
    // meta: { requiresAuth: true }, // 테스트용으로 넣어놈
  },

  ...authRoutes, // 인증 관련 화면 라우트 연결
  ...mypageRoutes, // 마이페이지 관련 화면 라우트 연결
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

// 전역 인증 가드 (로그인 여부)
router.beforeEach(async (to, from, next) => {
  if (!to.meta.requiresAuth) {
    return next();
  }

  try {
    const res = await apiClient.get("/api/member/loggedin", {
      mwithCredentials: true,  // HttpOnly 쿠키 포함 요청
    });
    if (res.status === 200) {
      next(); // 인증 성공 -> 화면 이동
    } else {
      next("/auth/login"); // 인증 실패 -> 로그인 화면 이동
    }
  } catch (e) {
    console.error("인증 실패: ", e)
    next("/auth/login")
  }
});

export default router;
