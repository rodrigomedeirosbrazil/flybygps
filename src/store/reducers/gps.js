const INITIAL_STATE = {
  position: { mocked: true, avaliable: false},
  isOn: false
};

export default function gps(state = INITIAL_STATE, action) {
  console.log(state, action);
  if (action.type === "NEW_POSITION") {
    return { ...state, position: action.position };
  } else if (action.type === "TOGGLE_GPS") {
    return { ...state, isOn: action.isOn };
  }
  return state;
}
