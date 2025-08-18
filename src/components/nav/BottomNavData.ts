// 하단 네비 데이터 타입 정의
type WithoutBottomNavPageItem = {
  name: string;
};

type BottomNavMenuItem = {
  title: string;
  url: string;
  icon: [string, string];
};

type BottomNavList = {
  title: string;
  navBarMenus: BottomNavMenuItem[];
  withoutBottomNavPages: WithoutBottomNavPageItem[];
};

// 실제 하단 네비 데이터
const bottomNavList: BottomNavList = {
  title: "MZ 세대를 위한 부동산 안전거래 도우미 앱",
  navBarMenus: [
    { title: "홈", url: "/home", icon: ["fas", "house"] },
    { title: "지도", url: "/mapSearch", icon: ["far", "map"] },
    { title: "관심 목록", url: "/wishlist", icon: ["far", "star"] },
    { title: "전체 메뉴", url: "/mainMenu", icon: ["fas", "bars"] },
  ],
  withoutBottomNavPages: [
    { name: "splashScreen" },
    { name: "login" },
    { name: "loginEmail" },
    { name: "loginKakao" },
    { name: "loginGoogle" },
    { name: "register" },
    { name: "test" },
  ],
};

export default bottomNavList;
