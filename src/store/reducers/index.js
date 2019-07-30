import { combineReducers } from "redux";

import gps from "./gps";
import config from "./config";

export default combineReducers({
  gps,
  config
});
