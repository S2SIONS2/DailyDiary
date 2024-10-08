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
type SearchLists = {
    today?: string,
    chooseDate?: string
}
// post api type
type AddTodo = {
    chooseDate: string,
    todoList: Todo[]
}
// 일정이 이이 있을 때 투 두 리스트 추가 시
type UpdateTodo = {
    apiId: string | undefined,
    apiDate: string | undefined,
    todoList: Todo[]
}

// api 주소
const url = 'http://175.212.136.236:8081/calendar';

// api get 호출
export const fetchTodoLists = createAsyncThunk(
    'todoList/fetchLists',
    async ({ today, chooseDate }: SearchLists) => {
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
// 일정 없이 투두 리스트만 들어갈 때
export const addTodoLists = createAsyncThunk(
    'todoList/addList',
    async ({ chooseDate, todoList }: AddTodo ) => {
        const params = {
            id: getRandomId(),
            date: chooseDate,
            todoList: todoList,
        }
        const response = await axios.post(url, params)
        return response.data
    }
)

// 일정이 먼저 있다면
export const updateTodo = createAsyncThunk(
    'todoList/updateTodo',
    async ({apiId, apiDate, todoList}: UpdateTodo) => {
        const params = {
            id: apiId,
            date: apiDate,
            todoList: todoList,
        }
        const response = await axios.patch(url + `/${apiId}`, params)
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
            .addCase(addTodoLists.fulfilled, (state, action) => {
                state.todoList.push(action.payload)
            })
            .addCase(updateTodo.fulfilled, (state, action) => {
                const index = state.todoList.findIndex((list) => list.id === action.payload.id)
                state.todoList[index] = action.payload
            })
    }
})

export default todoListSlice.reducer;