import "@/assets/styles/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";


import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faHouse,faBars,faBell,faMagnifyingGlass,  faStar as fasStar,faArrowLeft,faShieldAlt,
  faChevronRight, } from "@fortawesome/free-solid-svg-icons"; // 홈
import {
  faMap,
  faStar as farStar,
  faCircleXmark,
  faHeart,
  faFileLines,
  faEnvelope,

} from "@fortawesome/free-regular-svg-icons"; // 지도, 관심, 전체메뉴


library.add(faHouse,
  faMap,
  fasStar,
  faBars,
  faBell,
  faMagnifyingGlass,
  faCircleXmark,
  farStar,
  faArrowLeft,
  faShieldAlt,
  faChevronRight,
  faHeart,
  faFileLines,
  faEnvelope);


const app = createApp(App);
app.component("font-awesome-icon", FontAwesomeIcon);
app.use(createPinia());
app.use(router);

app.mount("#app");
