import { createStackNavigator, createAppContainer } from "react-navigation";

import Home from "./screens/Home";
import Waypoints from "./screens/Waypoints";
import Waypoint from "./screens/Waypoint";

export default createAppContainer(
  createStackNavigator({
    Home,
    Waypoints,
    Waypoint
  })
);
