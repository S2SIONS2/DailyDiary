import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 달력 (일정 관리 및 투두 리스트) api 타입
interface List {
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
    }
})

export default scheduleSlice.reducer;