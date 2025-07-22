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
} from "@fortawesome/free-solid-svg-icons";
import { faMap, faStar as farStar, faCircleXmark } from "@fortawesome/free-regular-svg-icons";
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

export { FontAwesomeIcon };
