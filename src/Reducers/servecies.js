import {
  GET_SERVECIES,
  DELETE_SERVECIES,
  ADD_SERVECIES,
  UPDATE_SERVEC,
} from '../actions/servecies/type';
const initialState = {
  servecies: [],
  servec: {},
};
export default (state = initialState, action) => {
  const { type } = action;
  switch (type) {
    case GET_SERVECIES:
      return {
        ...state,
        servecies: action.payload,
      };

    case DELETE_SERVECIES:
      return {
        ...state,
        servecies: state.servecies.filter(
          (servec) => servec.id !== action.payload,
        ),
      };

    case ADD_SERVECIES:
      return {
        ...state,
        servecies: [action.payload, ...state.servecies],
      };
    case UPDATE_SERVEC:
      return {
        ...state,
        servecies: state.servecies.map((servec) =>
          servec.id === action.payload.id ? (servec = action.payload) : servec,
        ),
      };
    default:
      return state;
  }
};
