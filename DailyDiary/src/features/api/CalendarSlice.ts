import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

// to do list
interface TodoItem {
    checked: boolean,
    content: string
}

// 공통 
interface CalendarListState {
    id: string,
    date: string,
    scheduleList: string[],
    todoList: TodoItem[],
    status: 'idle' | 'loading' | 'failed'
}

const initialState: CalendarListState = {
    id: '',
    date: '',
    scheduleList: [],
    todoList: [],
    status: 'idle'
}

// api 검색 타입 정의
type SearchLists = {
    today? : string,
    chooseDate? : string
}

// api 생성 타입 정의
type CreateAPI = {
    today?: string,
    chooseDate?: string,
    schedule: string[],
    toDoList: TodoItem[]
}
// 스케줄만 생성
type CreateSchedule = {
    today?: string,
    chooseDate?: string,
    schedule: string[],
}
// 투 두 리스트만 생성
type CreateToDoList = {
    today?: string,
    chooseDate?: string,
    toDoList: TodoItem[]
}
// 기존 스케줄 수정 시 타입 정의
type CorrectSchedule = {
    apiID?: string | undefined,
    apiDate?: string | undefined,
    correctionSchedule: string[]
}
// 기존 스케줄에 추가 스케줄 생길 시 타입 정의
type UpdateSchedule = {
    apiID?: string | undefined,
    apiDate?: string | undefined,
    apiScheduleList: string[] | string[][]
    schedule: string[]
}
// 기존 스케줄 수정 및 새 스케줄 추가
type NewSchedule = {
    apiID?: string | undefined,
    apiDate?: string | undefined,
    correctionSchedule: string[],
    schedule: string[]
}
// 스케줄 삭제 시
type DeleteSchedule = {
    apiID?: string | undefined,
    apiScheduleList: string[],
    i: number
}

// 투 두 리스트 추가 시
type UpdateTodo = {
    apiID?: string | undefined,
    apiDate? : string | undefined,
    apiTodoList: TodoItem[],
    toDoList: TodoItem[]
}
// 투 두 리스트 수정 시
type CorrectTodos = {
    apiID?: string | undefined,
    apiDate? : string | undefined,
    correctionTodos: TodoItem[],
    toDoList: TodoItem[]
}
// 투 두 리스트 추가 + 수정
type NewTodoList = {
    apiID?: string | undefined,
    apiDate?: string | undefined,
    correctionTodos: TodoItem[],
    toDoList: TodoItem[]
}
// 투 두 리스트 삭제 시
type DeleteTodo = {
    apiID?: string | undefined,
    apiTodoList: TodoItem[],
    i: number
}

// api 호출 주소
const url = 'http://175.212.136.236:8081/calendar';

// 비동기 액션 생성
// api get
export const fetchCalendatList = createAsyncThunk(
    'calendars/fetchCalendatList',
    async ({today, chooseDate} : SearchLists) => {
        // 선택 된 날짜가 없을 때 오늘 날짜 검색
        const dateParam = (!chooseDate || isNaN(new Date(chooseDate).getTime())) ? today : chooseDate;
        const params = {
            date: dateParam 
        }
        const response = await axios.get(url + '/', {params});
        return response.data
    }
)

// api post
// api가 없을 때
// 랜덤 아이디 값 생성
const getRandomId = () => {
    const now = new Date();
    const timeStamp = now.getTime();
    const randomNum = Math.floor(Math.random() * 10000)
    return `${timeStamp} - ${randomNum}`
}
// 스케줄, 투 두 리스트가 둘 다 동시에 생성 될 때
export const addCalendar = createAsyncThunk(
    'calendars/addCalendars',
    async({today, chooseDate, schedule, toDoList }: CreateAPI) => {
        const dateParam = (!chooseDate || isNaN(new Date(chooseDate).getTime())) ? today : chooseDate;
        const params = {
            id: getRandomId(),
            date: dateParam,
            schedule: schedule,
            todoList: toDoList
        }
        const response = await axios.post(url, params)
        return response.data
    }
)
// 스케줄만 생성될 때
export const addSchedules = createAsyncThunk(
    'calendars/addSchedules',
    async ({today, chooseDate, schedule}: CreateSchedule) => {
        const dateParam = (!chooseDate || isNaN(new Date(chooseDate).getTime())) ? today : chooseDate;
        const params = {
            id: getRandomId(),
            date: dateParam,
            schedule: schedule
        }
        const response = await axios.post(url, params)
        return response.data
    }
)
// 투 두 리스트만 생성될 때
export const addTodoLists = createAsyncThunk(
    'calendars/addTodoLists',
    async({ today, chooseDate, toDoList }: CreateToDoList) => {
        const dateParam = (!chooseDate || isNaN(new Date(chooseDate).getTime())) ? today : chooseDate;
        const params = {
            id: getRandomId(),
            date: dateParam,
            todoList: toDoList
        }
        const response = await axios.post(url, params)
        return response.data
    }
)

// api 기존 스케줄 수정
export const correctSchedule = createAsyncThunk(
    'calendars/correctSchedule',
    async ({ apiID, apiDate, correctionSchedule = [] }: CorrectSchedule) => {
        const params = {
            id: apiID,
            date: apiDate,
            schedule: correctionSchedule
        }
        const response = await axios.patch(url + `/${apiID}`, params)
        return response.data
    }
)

// 기존 api에 스케줄 추가
export const updateSchedule = createAsyncThunk(
    'calendars/updateSchedule',
    async ({ apiID, apiDate, apiScheduleList, schedule }: UpdateSchedule) => {
        const updatedSchedule = [...apiScheduleList || [], ...schedule]
        const params = {
            id: apiID,
            date: apiDate,
            schedule: updatedSchedule
        }
        const response = await axios.patch(url + `/${apiID}`, params)
        return response.data
    }
)

// 기존 api 스케줄 수정과 추가 동시에 이루어질 때
export const newSchedule = createAsyncThunk(
    'calendars/newSchedule',
    async ( { apiID, apiDate, correctionSchedule, schedule}: NewSchedule) => {
        const newScheduleList = [...correctionSchedule || [], ...schedule]
        const params = {
            id: apiID,
            date: apiDate,
            schedule: newScheduleList
        }
        const response = await axios.patch(url + `/${apiID}`, params)
        return response.data
    }
)

// api 스케줄 삭제 시
export const deleteScheduleList = createAsyncThunk(
    'calendars/deleteSchedule',
    async ({ apiID, apiScheduleList, i }: DeleteSchedule) => {
        const newScheduleList =  apiScheduleList? apiScheduleList.filter((_, index) => index !== i) : [];
        const params = {
            id: apiID,
            schedule: newScheduleList
        };
        const response = await axios.patch(url + `/${apiID}`, params)

        return response.data;
    }
);

// 투 두 리스트 추가 시
export const updateTodos = createAsyncThunk(
    'calendars/updateTodos',
    async ({ apiID, apiDate, apiTodoList, toDoList }: UpdateTodo) => {
        const updatedSchedule = [...apiTodoList || [], ...toDoList]
        const params = {
            id: apiID,
            date: apiDate,
            todoList: updatedSchedule
        }
        const response = await axios.patch(url + `/${apiID}`, params)
        return response.data
    }
)
// 투 두 리스트 수정 시
export const correctTodo = createAsyncThunk(
    'calendars/correctTodos',
    async ({ apiID, apiDate, correctionTodos = [] }: CorrectTodos) => {
        const params = {
            id: apiID,
            date: apiDate,
            todoList: correctionTodos
        }
        const response = await axios.patch(url + `/${apiID}`, params)
        return response.data
    }
)
// 기존 api 투 두 리스트 수정과 추가 동시에 이루어질 때
export const newTodo = createAsyncThunk(
    'calendars/newTodo',
    async ( { apiID, apiDate, correctionTodos, toDoList}: NewTodoList) => {
        const newTodoList = [...correctionTodos || [], ...toDoList]
        const params = {
            id: apiID,
            date: apiDate,
            todoList: newTodoList
        }
        const response = await axios.patch(url + `/${apiID}`, params)
        return response.data
    }
)
// api 투 두 리스트 삭제 시
export const deleteTodoList = createAsyncThunk(
    'calendars/deleteTodoList',
    async ({ apiID, apiTodoList, i }: DeleteTodo) => {
        const newTodoList = apiTodoList? apiTodoList.filter((_, index) => index !== i) : []
        const params = {
            id: apiID,
            todoList: newTodoList
        }
        const response = await axios.patch(url + `/${apiID}`, params)
        return response.data
    } 
)

// slice 생성
const scheduleSlice = createSlice({
    name: 'calendars',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // 리스트 불러옴 
            .addCase(fetchCalendatList.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchCalendatList.fulfilled, (state, action) => {
                state.status = 'idle';
                state.date = action.payload[0]?.date;
                state.id = action.payload[0]?.id;
                state.scheduleList = action.payload[0]?.schedule ;
                state.todoList = action.payload[0]?.todoList; 
            })

            // 새로 api 생성 시 
            // 스케줄 + 투 두 리스트
            .addCase(addCalendar.fulfilled, (state, action) => {
                state.scheduleList = action.payload.schedule;
                state.todoList = action.payload.todoList;
            })
            // 새로 api - 스케줄만 생성 시
            .addCase(addSchedules.fulfilled, (state, action) => {
                state.scheduleList = action.payload.schedule;
            })
            // 새로 api - 투 두 리스트만 생성 시
            .addCase(addTodoLists.fulfilled, (state, action) => {
                state.todoList = action.payload.todoList;
            })
            
            // 기존 api에 스케줄만 추가 시
            .addCase(updateSchedule.fulfilled, (state, action) => {
                state.scheduleList = action.payload.schedule;
                state.todoList = action.payload.todoList
            })
            // 기존 api에 스케줄만 수정 시
            .addCase(correctSchedule.fulfilled, (state, action) => {
                state.scheduleList = action.payload.schedule;
            })
            // 기존 api에 스케줄 삭제
            .addCase(deleteScheduleList.fulfilled, (state, action) => {
                state.scheduleList = action.payload.schedule;
            })
            // 기존 api - 스케줄 수정 + 추가
            .addCase(newSchedule.fulfilled, (state, action) => {
                state.scheduleList = action.payload.schedule;
            })

            // 기존 api에 투 두 리스트 추가
            .addCase(updateTodos.fulfilled, (state, action) => {
                state.todoList = action.payload.todoList
                state.scheduleList = action.payload.schedule;
            })
            // 기존 api에 투 두 리스트 수정
            .addCase(correctTodo.fulfilled, (state, action) => {
                state.scheduleList = action.payload.schedule;
                state.todoList = action.payload.todoList;
            })
            .addCase(newTodo.fulfilled, (state,action) => {
                state.todoList = action.payload.todoList
            })
            // 기존 api에 투 두 리스트 삭제
            .addCase(deleteTodoList.fulfilled, (state, action) => {
                state.todoList = action.payload.todoList;
            })
    }
})

export default scheduleSlice.reducer;