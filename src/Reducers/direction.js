import { RTL_DIRECTION, LTR_DIRECTION } from "../actions/direction/type";
const initialState = { rtl: false, ltr: false };
export default (state = initialState, action) => {
  switch (action.type) {
    case RTL_DIRECTION:
      var rtl = { ltr: false, rtl: true };

      return { ...state, ...rtl };
    case LTR_DIRECTION:
      var ltr = { rtl: false, ltr: true };
      return { ...state, ...ltr };
    default:
      return state;
  }
};
