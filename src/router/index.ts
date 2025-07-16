import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import authRoutes from "./authRoutes";
import mypageRoutes from "./mypageRoutes";

const routes: RouteRecordRaw[] = [
  // 홈 화면
  {
    path: "/",
    name: "home",
    component: () => import("@/pages/navbar/HomePage.vue"),
  },
  {
    path: "/about",
    name: "about",
    component: () => import("@/pages/info/AboutPage.vue"),
  },
  {
    path: "/map",
    name: "map",
    component: () => import("@/pages/navbar/MapPage.vue"),
  },
  {
    path: "/favorite",
    name: "favorite",
    component: () => import("@/pages/navbar/FavoritePage.vue"),
  },
  {
    path: "/menu",
    name: "menu",
    component: () => import("@/pages/navbar/MenuPage.vue"),
  },
  {
    path: "/menupage",
    name: "menupage",
    component: () => import("@/pages/navbar/MenuPage.vue"),
  },
  {
    path: "/safereport",
    name: "safereport",
    component: () => import("@/pages/main/SafeReportPage.vue"),
  },
  {
    path: "/localinfo",
    name: "localinfo",
    component: () => import("@/pages/main/LocalInfoPage.vue"),
  },  {
    path: "/localinfosearch",
    name: "localinfosearch",
    component: () => import("@/pages/main/LocalInfoSearchPage.vue"),
  },
  {
    path: "/alarmpage",
    name: "alarmpage",
    component: () => import("@/pages/alarm/AlarmPage.vue"),
  },
  ...authRoutes,        // 인증 관련 화면 라우트 연결
  ...mypageRoutes,      // 마이페이지 관련 화면 라우트 연결
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
})

export default router;
