import axios from "axios";
export const getProducts = () => async (dispatch) => {
  const res = await axios.get("https://jsonplaceholder.typicode.com/users");
  dispatch({
    type: "GET_PERMISSIONS",
    payload: res.data,
  });
};
