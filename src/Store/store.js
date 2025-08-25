import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../Reducers/root';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: import.meta.env.NODE_ENV !== 'production',
});

export default store;
