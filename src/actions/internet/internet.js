import { INTERNET, NO_INTERNET } from './type';
export const noInternet = () => {
  return {
    type: NO_INTERNET,
  };
};
export const internet = (payload) => (dispatch) => {
  // return {
  //   type: INTERNET,
  // };
  dispatch({
    type: INTERNET,
    payload: payload,
  });
};
