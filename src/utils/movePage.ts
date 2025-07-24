import { myPageRouteName } from "@/router/mypageRoutes";
import { mainRouteName } from "@/router/mainRoute";
import router from "@/router";

//라우트 생성
const makeRoute = (routeName: string) => {
  //쿼리 생성
  const makeQuery = (query?: Record<string, string>) => {
    const routeConfig: any = {
      name: routeName,
    };

    if (query) {
      routeConfig.query = query;
    }

    router.push(routeConfig);
  };

  return makeQuery;
};

// route naem 기반 페이지 이동
const movePage = {
  back() {
    router.back();
  },

  // mainRouteName start
  homeMain: makeRoute(mainRouteName.homeMain),
  mapSearch: makeRoute(mainRouteName.mapSearch),
  myLike: makeRoute(mainRouteName.myLike),
  safeReport: makeRoute(mainRouteName.safeReport),
  myAlarm: makeRoute(mainRouteName.myAlarm),
  localInfo: makeRoute(mainRouteName.localInfo),
  localInfoSearch: makeRoute(mainRouteName.localInfoSearch),
  // mainRouteName end

  // myPageRouteName start
  mypage: makeRoute(myPageRouteName.mypage),
  myProfile: makeRoute(myPageRouteName.myProfile),
  editProfile: makeRoute(myPageRouteName.editProfile),
  myPageMain: makeRoute(myPageRouteName.myPageMain),
  // myPageRouteName end
};
export default movePage;
