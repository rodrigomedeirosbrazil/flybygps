export const toggleGpsAction = isOn => {
    return {
        type: "TOGGLE_GPS",
        isOn
    };
}

export const newPositionAction = position =>  {
    return {
        type: "NEW_POSITION",
        position
    };
}