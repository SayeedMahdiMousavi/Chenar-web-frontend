import { INTERNET } from "../actions/internet/type";
const initialState = { intr: false };
export default (state = initialState, action) => {
  switch (action.type) {
    case INTERNET:
      var noIntr = { intr: action.payload };
      return { ...state, ...noIntr };
    // case NO_INTERNET:
    //   var intr = { intr: false };
    //   return { ...state, ...intr };
    default:
      return state;
  }
};
