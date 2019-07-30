const INITIAL_STATE = {
  waypoints: [
    {
      name: "Pouso São Vicente",
      lat: -23.969759,
      lon: -46.362456,
      alt: 2
    },
    {
      name: "Pouso Praia Grande",
      lat: -24.038557,
      lon: -46.495991,
      alt: 4
    }
  ],
  waypoint: {
    name: "Pouso Praia Grande",
    lat: -24.038557,
    lon: -46.495991,
    alt: 4
  }
};

export default function config(state = INITIAL_STATE, action) {
  if (action.type === "UPDATE_WAYPOINTS") {
    return { ...state, waypoints: action.waypoints };
  } else if (action.type === "SET_WAYPOINT") {
    return { ...state, waypoint: action.waypoint };
  }
  return state;
}
