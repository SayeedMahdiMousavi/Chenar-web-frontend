import { combineReducers } from "redux";
import productReducer from "./product";
import directionReducer from "./direction";
import internet from "./internet";
import serveciesReducer from "./servecies";
export default combineReducers({
  products: productReducer,
  direction: directionReducer,
  servecies: serveciesReducer,
  internet: internet,
});
