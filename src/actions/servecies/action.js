import {
  GET_SERVECIES,
  ADD_SERVECIES,
  DELETE_SERVECIES,
  UPDATE_SERVEC
} from "./type";
import axios from "axios";
export const getServecies = () => async dispatch => {
  const res = await axios.get("https://jsonplaceholder.typicode.com/users");
  dispatch({
    type: GET_SERVECIES,
    payload: res.data
  });
};

export const deleteServecies = id => async dispatch => {
  await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
  dispatch({
    type: DELETE_SERVECIES,
    payload: id
  });
};

export const addServecies = products => async dispatch => {
  const res = await axios.post(
    `https://jsonplaceholder.typicode.com/users`,
    products
  );
  dispatch({
    type: ADD_SERVECIES,
    payload: res.data
  });
};
export const updateServecie = products => async dispatch => {
  const res = await axios.put(
    `https://jsonplaceholder.typicode.com/users/${products.id}`,
    products
  );
  dispatch({
    type: UPDATE_SERVEC,
    payload: res.data
  });
};
