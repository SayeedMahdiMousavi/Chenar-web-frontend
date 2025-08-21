import {
  GET_PRODUCTS,
  DELETE_PRODUCTS,
  ADD_PRODUCTS,
  UPDATE_PRODUCT,
} from '../actions/products/types';
const initialState = {
  products: [],
  product: {},
};
export default (state = initialState, action) => {
  const { type } = action;
  switch (type) {
    case GET_PRODUCTS:
      return {
        ...state,
        products: action.payload,
      };

    case DELETE_PRODUCTS:
      return {
        ...state,
        products: state.products.filter(
          (prodcut) => prodcut.id !== action.payload
        ),
      };

    case ADD_PRODUCTS:
      return {
        ...state,
        products: [action.payload, ...state.products],
      };
    case UPDATE_PRODUCT:
      return {
        ...state,
        products: state.products?.map((product) =>
          product.id === action.payload.id
            ? (product = action.payload)
            : product
        ),
      };
    default:
      return state;
  }
};
