import { configureStore } from '@reduxjs/toolkit';
import bookReducer from '../features/api/BookSlice.ts';

export const store = configureStore({
  reducer: {
    books: bookReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
