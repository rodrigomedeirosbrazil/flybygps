const INITIAL_STATE = {
  position: { mocked: true, avaliable: false },
  oldPosition: null,
  isOn: false
};

export default function gps(state = INITIAL_STATE, action) {
  if (action.type === "NEW_POSITION") {
    const oldPosition = state.position;
    return { ...state, position: action.position, oldPosition };
  } else if (action.type === "TOGGLE_GPS") {
    return { ...state, isOn: action.isOn };
  }
  return state;
}
