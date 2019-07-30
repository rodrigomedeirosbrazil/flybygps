import { createStackNavigator, createAppContainer } from "react-navigation";

import Home from "./screens/Home";
import Waypoints from "./screens/Waypoints";

export default createAppContainer(
  createStackNavigator({
    Home,
    Waypoints
  })
);
