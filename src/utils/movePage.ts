import { myPageRouteName } from "@/router/mypageRoutes";
import { mainRouteName } from "@/router/mainRoute";
import { authRouteName } from "@/router/authRoute";
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

// route name 기반 페이지 이동
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

  // authRouteName start
  login: makeRoute(authRouteName.login),
  loginEmail: makeRoute(authRouteName.loginEmail),
  loginKakao: makeRoute(authRouteName.loginKakao),
  loginGoogle: makeRoute(authRouteName.loginGoogle),
  register: makeRoute(authRouteName.register),
  // authRouteName end

  //실거래가 상세페이지
  transactionDetail: makeRoute(mainRouteName.transactionDetail),


  // myPageRouteName start
  mypage: makeRoute(myPageRouteName.mypage),
  mypageStetting: makeRoute(myPageRouteName.alarmSetting),
  // myPageRouteName end
};
export default movePage;
