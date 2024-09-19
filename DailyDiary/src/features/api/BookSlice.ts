// src/features/api/BookSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface BookState {
  bookList: any[];
  status: 'idle' | 'loading' | 'failed';
}

const initialState: BookState = {
  bookList: [],
  status: 'idle',
};

// 비동기 액션 생성
export const fetchBooks = createAsyncThunk(
  'books/fetchBooks',
  async () => {
    const response = await axios.get('/book.json', {
      params: { query: '사랑' },
      headers: {
        'X-Naver-Client-Id': import.meta.env.VITE_BOOK_API_ID,
        'X-Naver-Client-Secret': import.meta.env.VITE_BOOK_API_PW
      }
    });
    return response.data;
  }
);

const bookSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => { // fetchBooks가 시작되었을 때 상태
        state.status = 'loading';
      })
      .addCase(fetchBooks.fulfilled, (state, action) => { // 비동기 액션인 fetchBooks가 성공적으로 완료되었을 때 상태
        state.status = 'idle';
        state.bookList = action.payload.items;
      })
      .addCase(fetchBooks.rejected, (state) => { // fetchBooks가 실패했을 때
        state.status = 'failed';
      });
  },
});

export default bookSlice.reducer;
