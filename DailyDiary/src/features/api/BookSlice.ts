import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// naver 책 검색 api
interface Book {
    title: string,
    author: string,
    description : string,
    image : string,
    link : string,
    isbn: string,
}

interface BookState {
  bookList: Book[];
  totalBookList: number;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: BookState = {
  bookList: [],
  totalBookList: 0,
  status: 'idle',
};

type searchParams = {
    bookTitle: string,
    currentPage: number
}

// 비동기 액션 생성
export const fetchBooks = createAsyncThunk(
  'books/fetchBooks',
  async ( {bookTitle, currentPage}: searchParams ) => {
    if(bookTitle) {
        const response = await axios.get('/book.json', {
          params: { 
            query: bookTitle,
            display : 3,
            start : currentPage
         },
          headers: {
            'X-Naver-Client-Id': import.meta.env.VITE_BOOK_API_ID,
            'X-Naver-Client-Secret': import.meta.env.VITE_BOOK_API_PW
          }
        });
        return response.data;
    }
  }
);

const bookSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    setLoadingStatus: (state) => {
      state.status = 'loading';
      state.bookList = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => { // fetchBooks가 시작되었을 때 상태
        state.status = 'loading';
        state.bookList = []
      })
      .addCase(fetchBooks.fulfilled, (state, action) => { // 비동기 액션인 fetchBooks가 성공적으로 완료되었을 때 상태
        state.status = 'idle';
        if (action.payload && action.payload.total !== undefined && action.payload.items) {
            state.totalBookList = action.payload.total;
            state.bookList = action.payload.items;
        } else {
        // 데이터를 받지 못했거나 구조가 다를 때 기본값 설정
            state.totalBookList = 0;
            state.bookList = [];
        }
      })
      .addCase(fetchBooks.rejected, (state) => { // fetchBooks가 실패했을 때
        state.status = 'failed';
      });
  },
});

export const { setLoadingStatus } = bookSlice.actions;
export default bookSlice.reducer;
