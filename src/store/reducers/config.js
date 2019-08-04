const INITIAL_STATE = {
  waypoints: [],
  waypoint: null
};

export default function config(state = INITIAL_STATE, action) {
  if (action.type === "UPDATE_WAYPOINTS") {
    return { ...state, waypoints: [...action.waypoints] };
  } else if (action.type === "SET_WAYPOINT") {
    return { ...state, waypoint: action.waypoint };
  }
  return state;
}
