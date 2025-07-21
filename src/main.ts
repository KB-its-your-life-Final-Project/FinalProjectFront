import "@/assets/styles/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faHouse,
  faBars,
  faBell,
  faMagnifyingGlass,
  faStar as fasStar,
  faArrowLeft,
  faVideo,
  faUsers,
  faShop,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons"; // 홈
import { faMap, faStar as farStar, faCircleXmark } from "@fortawesome/free-regular-svg-icons"; // 지도, 관심, 전체메뉴
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
  faHouse,
  faMap,
  fasStar,
  faBars,
  faBell,
  faMagnifyingGlass,
  faCircleXmark,
  farStar,
  faArrowLeft,
  faVideo,
  faUsers,
  faShop,
  faUtensils,
);

const app = createApp(App);
app.component("font-awesome-icon", FontAwesomeIcon);
app.use(createPinia());
app.use(router);

app.mount("#app");
