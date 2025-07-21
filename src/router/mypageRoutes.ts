import type { RouteRecordRaw } from "vue-router";

//라우트 파일 위치
const myPageRouteMap: Record<string, () => Promise<any>> = {
  //마이페이지 메인
  myPageMain: () => import("../pages/mypage/MyMainPage.vue"),

  //프로필
  myProfile: () => import("@/pages/mypage/ProfilePage.vue"),

  //프로필 수정
  editProfile: () => import("@/pages/mypage/EditPage.vue"),
};

//라우트 이름
const myPageRouteName = {
  mypage: "mypage",
  myProfile: "myProfile",
  editProfile: "editProfile",
  myPageMain: "myPageMain",
};

//라우트 설정
const myPageRouteRecordRaw: RouteRecordRaw[] = [
  {
    path: "/mypage",
    children: [
      {
        path: "/profile",
        name: myPageRouteName.myProfile,
        component: myPageRouteMap.myProfile,
      },
      {
        path: "/mypage/edit",
        name: myPageRouteName.editProfile,
        component: myPageRouteMap.editProfile,
      },
      {
        path: "/mypage/main",
        name: myPageRouteName.myPageMain,
        component: myPageRouteMap.myPageMain,
      },
    ],
  },
];
export { myPageRouteMap, myPageRouteName, myPageRouteRecordRaw };
