import {
  GET_PRODUCTS,
  ADD_PRODUCTS,
  DELETE_PRODUCTS,
  UPDATE_PRODUCT
} from "./types";
import axios from "axios";
export const getProducts = () => async dispatch => {
  const res = await axios.get("https://jsonplaceholder.typicode.com/users");
  dispatch({
    type: GET_PRODUCTS,
    payload: res.data
  });
};

export const deleteProducts = id => async dispatch => {
  await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
  dispatch({
    type: DELETE_PRODUCTS,
    payload: id
  });
};

export const addProducts = products => async dispatch => {
  const res = await axios.post(
    `https://jsonplaceholder.typicode.com/users`,
    products
  );
  dispatch({
    type: ADD_PRODUCTS,
    payload: res.data
  });
};
export const updateProduct = products => async dispatch => {
  const res = await axios.put(
    `https://jsonplaceholder.typicode.com/users/${products.id}`,
    products
  );
  dispatch({
    type: UPDATE_PRODUCT,
    payload: res.data
  });
};
