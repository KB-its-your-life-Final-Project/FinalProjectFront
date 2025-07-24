import { Component } from "vue";
import type { RouteRecordRaw } from "vue-router";

//라우트 파일 위치
const myPageRouteMap: Record<string, () => Promise<Component>> = {
  //마이페이지 메인
  myPageMain: () => import("../pages/mypage/MyMainPage.vue"),
};

//라우트 이름
const myPageRouteName = {
  mypage: "mypage",
};

//라우트 설정
const myPageRouteRecordRaw: RouteRecordRaw[] = [
  {
    path: "/mypage",
    name: myPageRouteName.mypage,
    component: myPageRouteMap.myPageMain,
  },
];
export { myPageRouteMap, myPageRouteName, myPageRouteRecordRaw };
