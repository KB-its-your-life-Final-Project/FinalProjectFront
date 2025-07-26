import "@/assets/styles/main.css";
import "@/assets/styles/colors.css";
import "@/assets/styles/fonts.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import { FontAwesomeIcon } from "@/plugins/fontawesome";

const app = createApp(App);
app.component("font-awesome-icon", FontAwesomeIcon);
app.use(createPinia());
app.use(router);

app.mount("#app");
