type BottomNavMenuItem = {
  title: string;
  url: string;
  icon: [string, string];
};

type BottomNavList = {
  title: string;
  navBarMenus: BottomNavMenuItem[];
};

const bottomNavList: BottomNavList = {
  title: "MZ 세대를 위한 부동산 안전거래 도우미 앱",
  navBarMenus: [
    { title: "홈", url: "/", icon: ["fas", "house"] },
    { title: "지도", url: "/map", icon: ["far", "map"] },
    { title: "내 찜 목록", url: "/favorite", icon: ["far", "star"] },
    { title: "전체 메뉴", url: "/menu", icon: ["fas", "bars"] },
  ],
};

export default bottomNavList;
