export const updateWaypointsAction = waypoints => {
  return {
    type: "UPDATE_WAYPOINTS",
    waypoints
  };
};

export const setWaypointAction = waypoint => {
  return {
    type: "SET_WAYPOINT",
    waypoint
  };
};
