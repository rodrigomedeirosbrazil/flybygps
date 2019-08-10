const INITIAL_STATE = {
  position: {},
  positions: [],
  isOn: false
};

export default function gps(state = INITIAL_STATE, action) {
  if (action.type === "NEW_POSITION") {
    let positions = [...state.positions, action.position];
    if (positions.length > 5) positions.shift();
    return { ...state, position: action.position, positions };
  } else if (action.type === "TOGGLE_GPS") {
    return { ...state, isOn: action.isOn };
  }
  return state;
}
