import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

// 독서록 관리 API
interface List {
    title: string,
    author: string,
    description: string,
    image: string,
    isbn: string,
    id: string
}

interface BookListState {
    saveBookList: List[]
    status: 'idle' | 'loading' | 'failed'
}

const initialState: BookListState = {
    saveBookList: [],
    status: 'idle'
}

// list 추가 시
type bookList = {
    bookTitle: string,
    author: string,
    bookImg: string,
    description: string,
    isbn: string,
    id?: string,
}
// list 수정 시
type updateBookList = {
    bookTitle: string,
    author: string,
    description: string,
    id: string,
}

// api 주소
const url = '/api/bookList';

// 비동기 액션 생성
// api get
export const fetchLists = createAsyncThunk(
    'lists/fetchLists',
    async () => {
        const response = await axios.get(url);
        return response.data
    }
)
// api post
export const addList = createAsyncThunk(
    'lists/addList',
    async ({ bookTitle, author, bookImg, description, isbn}: bookList) => {
        const params = {
            title: bookTitle,
            author: author,
            image: bookImg,
            description: description,
            isbn: isbn
        }
        const response = await axios.post(url, params)
        return response.data
    }
)
// api put
export const updateList = createAsyncThunk(
    'lists/updateList',
    async ({ bookTitle, author, description, id}:updateBookList ) => {
        const params = {
            title: bookTitle,
            author: author,
            description: description,
        }
        const response = await axios.patch(url + `/${id}`, params)
        return response.data
    }
)
// api delete
export const deleteBook = createAsyncThunk(
    'lists/deleteList',
    async ({id} : {id: string} ) => {
        await axios.delete(url + `/${id}`)
        return id;
    }
)
// list slice 생성
const listSlice = createSlice({
    name: 'lists',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLists.pending, (state) => { // list 호출 중
                state.status = 'loading'
            })
            .addCase(fetchLists.fulfilled, (state, action) => { // list 호출 대기
                state.status = 'idle';
                state.saveBookList = action.payload
            })
            .addCase(addList.fulfilled, (state, action) => { // list 추가
                state.saveBookList.push(action.payload)
            })
            .addCase(updateList.fulfilled, (state, action) => {
                const index = state.saveBookList.findIndex((list) => list.id === action.payload.id);
                if(index !== -1){
                    state.saveBookList[index] = action.payload
                }
            })
            .addCase(deleteBook.fulfilled, (state, action) => {
                state.saveBookList = state.saveBookList.filter((list) => list.id !== action.payload)
            })
    }
})

export default listSlice.reducer;