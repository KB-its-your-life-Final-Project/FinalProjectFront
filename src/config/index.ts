interface NavBarMenuItem {
  title: string;
  url: string;
}

interface AppConfig {
  title: string;
  navBarMenus: NavBarMenuItem[];
}

const appConfig: AppConfig = {
  title: "MZ 세대를 위한 부동산 안전거래 도우미 앱",
  navBarMenus: [
    { title: "홈", url: "/" },
    { title: "관심목록", url: "" },
    { title: "지도", url: "" },
    { title: "혜택", url: "" },
    { title: "메뉴", url: "" },
  ],
};

export default appConfig;
