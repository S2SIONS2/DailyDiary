import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 달력 (일정 관리 및 투두 리스트) api 타입
interface List {
    id: string,
    date : string,
    schedule : string[],
    todoList : object[]
}

interface CalendarApi {
    scheduleList: List[],
    status: 'idle' | 'loading' | 'failed'
}

const initialState: CalendarApi = {
    scheduleList: [], 
    status: 'idle'
}

// list 검색 타입
type searchSchedule = {
    chooseDate: string
}

// list 추가 시 타입
type ScheduleList = {
    id?: string,
    chooseDate: string,
    scheduleList: string[]
}
// list 수정 시 타입
type updateList = {
    apiId: string | undefined,
    apiDate: string | undefined,
    apiScheduleList?: string[]// 기존 리스트
    scheduleList?: string[] // 추가 할 리스트
}
// list 삭제 시 타입
type deleteList = {
    apiId: string | undefined,
    apiDate: string | undefined,
    newScheduleList?: string[]// 기존에 삭제 된 리스트
    scheduleList?: string[] // 추가 할 리스트
}

// api 주소
const url = 'http://175.212.136.236:8081/calendar';

// api get 호출
export const fetchLists = createAsyncThunk(
    'schedules/fetchLists',
    async ({chooseDate}: searchSchedule) => {
        const response = await axios.get(url, {
            params: {
                date: chooseDate
            }
        })
        return response.data
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
export const addList = createAsyncThunk(
    'schedules/addList',
    async ({ chooseDate, scheduleList }: ScheduleList) => {
        const params = {
            id: getRandomId(),
            date: chooseDate,
            schedule: scheduleList
        }
        const response = await axios.post(url, params)
        return response.data
    }
)

// api put
export const updateList = createAsyncThunk(
    'schedules/updateList',
    async ({apiId, apiDate, apiScheduleList = [], scheduleList = []}: updateList) => {
        // 기존 스케줄 리스트에 새로운 스케줄을 추가
        const updatedScheduleList = [...apiScheduleList, ...scheduleList];       
        // 병합된 스케줄 리스트로 Put 요청
        const params = {
            id: apiId,
            date: apiDate,
            schedule: updatedScheduleList
        };
        const response = await axios.put(url + `/${apiId}`, params)
        return response.data
    }
)

// api 기존 리스트 일부 삭제 및 새로 추가 시 
export const deleteList = createAsyncThunk(
    'schedules/deleteList',
    async ({apiId, apiDate, newScheduleList}: deleteList) => {
        // const updatedScheduleList = [...apiScheduleList, ...scheduleList];     
        const params = {
            id: apiId,
            date: apiDate,
            schedule: newScheduleList
        };
        const response = await axios.patch(url + `/${apiId}`, params)
        return response.data
    }
)

const scheduleSlice = createSlice({
    name: 'schedules',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLists.pending, (state) => { // list 호출 중
                state.status = 'loading'
            })
            .addCase(fetchLists.fulfilled, (state, action) => { // list 호출 대기
                state.status = 'idle';
                state.scheduleList = action.payload
            })
            .addCase(addList.fulfilled, (state, action) => { // list 추가
                state.scheduleList.push(action.payload)
            })
            .addCase(updateList.fulfilled, (state, action) => {
                const index = state.scheduleList.findIndex((list) => list.id === action.payload.id);
                state.scheduleList[index] = action.payload
            })
            .addCase(deleteList.fulfilled, (state, action) => {
                const index = state.scheduleList.findIndex((list) => list.id === action.payload.id);
                state.scheduleList[index] = action.payload
            })
    }
})

export default scheduleSlice.reducer;