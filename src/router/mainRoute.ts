import { RouteRecordRaw } from "vue-router";

//라우트 파일 위치
const mainRouteMap: Record<string, () => Promise<any>> = {
  //홈
  homeMain: () => import("@/pages/section/HomeMain.vue"),

  //지도
  mapSearch: () => import("@/pages/section/MapSearch.vue"),

  //찜
  myLike: () => import("@/pages/section/MyLike.vue"),

  //메인 메뉴
  mainMenu: () => import("@/pages/section/MainMenu.vue"),

  //안심 진단
  safeReport: () => import("@/pages/main/SafeReport.vue"),

  //알람
  myAlarm: () => import("@/pages/alarm/myAlarm.vue"),

  //안심진단
  localInfo: () => import("@/pages/main/LocalInfo.vue"),
  LocalInfoSearch: () => import("@/pages/main/LocalInfoSearch.vue"),
};

//라우트 이름
const mainRouteName = {
  homeMain: "homeMain",
  mapSearch: "mapSearch",
  myLike: "myLike",
  mainMenu: "mainMenu",
  safeReport: "safeReport",
  myAlarm: "myAlarm",
  localInfo: "localInfo",
  localInfoSearch: "localInfoSearch",
};

//라우트 설정
const mainRouteRecordRaw: RouteRecordRaw[] = [
  {
    path: "/",
    name: mainRouteName.homeMain,
    component: mainRouteMap.homeMain,
  },
  {
    path: "/mapSearch",
    name: mainRouteName.mapSearch,
    component: mainRouteMap.mapSearch,
  },
  {
    path: "/myLike",
    name: mainRouteName.myLike,
    component: mainRouteMap.myLike,
  },
  {
    path: "/mainMenu",
    name: mainRouteName.mainMenu,
    component: () => import("@/pages/section/MainMenu.vue"),
  },
  {
    path: "/safeReport",
    name: mainRouteName.safeReport,
    component: () => import("@/pages/main/SafeReport.vue"),
  },
  {
    path: "/localInfo",
    name: mainRouteName.localInfo,
    component: () => import("@/pages/main/LocalInfo.vue"),
  },
  {
    path: "/localInfoSearch",
    name: mainRouteName.localInfoSearch,
    component: () => import("@/pages/main/LocalInfoSearch.vue"),
  },
  {
    path: "/myAlarm",
    name: mainRouteName.myAlarm,
    component: () => import("@/pages/alarm/myAlarm.vue"),
  },
];

export { mainRouteMap, mainRouteName, mainRouteRecordRaw };
