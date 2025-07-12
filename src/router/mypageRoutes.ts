import type { RouteRecordRaw } from "vue-router";

const mypageRoutes: RouteRecordRaw[] = [
  {
    path: "/mypage",
    // component: () => import("뷰파일.vue"),
    children: [
      {
        path: "/mypage/profile",
        name: "profile",
        component: () => import("../pages/mypage/ProfilePage.vue"),
      },
      {
        path: "/mypage/edit",
        name: "edit",
        component: () => import("../pages/mypage/EditPage.vue"),
      },
    ],
  },
];
export default mypageRoutes;
