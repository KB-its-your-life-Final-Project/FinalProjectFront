import { mainRouteName } from "@/router/mainRoute";
import { myPageRouteName } from "@/router/mypageRoutes";
//기본 항목들 표기
const headerMenuList = {
  title: false,
  showBack: false,
  showAlarm: false,
};

//타이틀이 존재할 경우 타이틀 표기
const headerTitleList = {
  // [mainRouteName.homeMain]: "",
  [mainRouteName.mapSearch]: "지도",
  [mainRouteName.localInfo]: "동네.ZIP",
  [mainRouteName.safeReport]: "안심 진단 레포트",
  [mainRouteName.safeReportResult]: "안심 진단 결과",
  [mainRouteName.recentSafeReport]: "최근 본 레포트",
  [mainRouteName.localInfoSearch]: "동네.ZIP",
  [mainRouteName.myAlarm]: "알람",
  [mainRouteName.myLike]: "내 찜 목록",
  [mainRouteName.mainMenu]: "전체 메뉴",
  [mainRouteName.transactionDetail]: "",
  [mainRouteName.myPage]: "마이 페이지",
  [myPageRouteName.alarmSetting]: "알림 설정",
};

//헤더에 따라 표기해야할 것 정의
const headerShowList = {
  [mainRouteName.homeMain]: ["showAlarm"],
  [mainRouteName.mapSearch]: ["showAlarm", "showBack"],
  [mainRouteName.localInfo]: ["showAlarm", "showBack"],
  [mainRouteName.safeReport]: ["showAlarm", "showBack"],
  [mainRouteName.safeReportResult]: ["showBack"],
  [mainRouteName.recentSafeReport]: ["showBack"],
  [mainRouteName.localInfoSearch]: ["showAlarm", "showBack"],
  [mainRouteName.myAlarm]: ["showBack"],
  [mainRouteName.myLike]: ["showBack", "showAlarm"],
  [mainRouteName.mainMenu]: ["showAlarm"],
  [mainRouteName.transactionDetail]: ["showAlarm", "showBack"],
  [mainRouteName.myPage]: ["showAlarm", "showBack"],
  [myPageRouteName.alarmSetting]: ["showAlarm", "showBack"],
};
type headerShowtype = keyof typeof headerShowList;

export type { headerShowtype };
export { headerMenuList, headerTitleList, headerShowList };
