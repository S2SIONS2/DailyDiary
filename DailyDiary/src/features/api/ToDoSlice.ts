import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Todo {
    checked: boolean,
    content: string
}

interface List {
    id: string,
    date : string,
    schedule? : string[],
    todoList? : Todo[]
}

interface ToDoList {
    todoList : List[],
    status: 'idle' | 'loading' | 'failed'
}

const initialState: ToDoList = {
    todoList: [], 
    status: 'idle'
}
// get api type
type searchLists = {
    today?: string,
    chooseDate?: string
}
// post api type
type addTodo = {
    chooseDate: string,
    checked: boolean,
    content: ''
}

// api 주소
const url = 'http://175.212.136.236:8081/calendar';

// api get 호출
export const fetchTodoLists = createAsyncThunk(
    'todoList/fetchLists',
    async ({ today, chooseDate }: searchLists) => {
        const dateParam = (!chooseDate || isNaN(new Date(chooseDate).getTime())) ? today : chooseDate;
        const response = await axios.get(url, {
            params: {
                date: dateParam
            }
        });
        return response.data;
    }
)

// api post
// 랜덤 id 값 생성
const getRandomId = () => {
    const now = new Date();
    const timeStamp = now.getTime();
    const randomNum = Math.floor(Math.random() * 10000)
    return `${timeStamp}-${randomNum}`;
}
export const addTodoList = createAsyncThunk(
    'todoList/addList',
    async ({ chooseDate, checked, content }: addTodo ) => {
        const params = {
            id: getRandomId(),
            date: chooseDate,
            checked: checked,
            content: content
        }
        const response = await axios.post(url, params)
        return response.data
    }
)

const todoListSlice = createSlice({
    name: 'todoList',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodoLists.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchTodoLists.fulfilled, (state, action) => { // list 호출 대기
                state.status = 'idle';
                state.todoList = action.payload
            })
            .addCase(addTodoList.fulfilled, (state, action) => {
                state.todoList.push(action.payload)
            })
    }
})

export default todoListSlice.reducer;