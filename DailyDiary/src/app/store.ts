import { configureStore } from '@reduxjs/toolkit';
import bookReducer from '../features/api/BookSlice.ts';
import listReducer from '../features/api/BookListSlice.ts'

export const store = configureStore({
  reducer: {
    books: bookReducer,
    lists: listReducer,
  },
  devTools: process.env.NODE_ENV !== 'production'
});

export default store;

// RootState 타입 정의
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
