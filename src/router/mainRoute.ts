import { RouteRecordRaw } from "vue-router";

//라우트 파일 위치
const mainRouteMap: Record<string, () => Promise<any>> = {
  //홈
  homeMain: () => import("@/pages/home/HomeMain.vue"),

  //지도
  mapSearch: () => import("@/pages/mapSearch/MapSearch.vue"),

  //찜
  myLike: () => import("@/pages/myLike/MyLike.vue"),

  //메인 메뉴
  mainMenu: () => import("@/pages/mainMenu/MainMenu.vue"),

  //안심 진단
  safeReport: () => import("@/pages/safeReport/SafeReport.vue"),

  //알람
  myAlarm: () => import("@/pages/alarm/myAlarm.vue"),

  //안심진단
  localInfo: () => import("@/pages/localInfo/LocalInfo.vue"),
  LocalInfoSearch: () => import("@/pages/localInfo/LocalInfoSearch.vue"),

  //실거래가 상세페이지
  transactionDetail: () => import("@/pages/transaction/TransactionDetailPage.vue"),
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
  myPage: "myPage",
  transactionDetail: "transactionDetail",
};

//라우트 설정
const mainRouteRecordRaw: RouteRecordRaw[] = [
  {
    path: "/home",
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
    component: () => import("@/pages/mainMenu/MainMenu.vue"),
  },
  {
    path: "/safeReport",
    name: mainRouteName.safeReport,
    component: () => import("@/pages/safeReport/SafeReport.vue"),
  },
  {
    path: "/localInfo",
    name: mainRouteName.localInfo,
    component: () => import("@/pages/localInfo/LocalInfo.vue"),
  },
  {
    path: "/localInfoSearch",
    name: mainRouteName.localInfoSearch,
    component: () => import("@/pages/localInfo/LocalInfoSearch.vue"),
  },
  {
    path: "/myAlarm",
    name: mainRouteName.myAlarm,
    component: () => import("@/pages/alarm/myAlarm.vue"),
  },
  {
    path: "/transactionDetail",
    name: mainRouteName.transactionDetail,
    component: () => import("@/pages/transaction/TransactionDetailPage.vue"),
  },
  {
    path: "/transactionDetail/:aptName",
    name: "transactionDetailAptName",
    component: () => import("@/pages/transaction/TransactionDetailPage.vue"),
  },
];

export { mainRouteMap, mainRouteName, mainRouteRecordRaw };
