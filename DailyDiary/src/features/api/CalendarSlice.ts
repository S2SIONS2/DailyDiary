import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

// 스케줄 api
interface Schedule {
    schedule: string[]
}

interface ScheduleListState {
    scheduleList: Schedule[],
    status: 'idle' | 'loading' | 'failed'
}

const initialState: ScheduleListState = {
    scheduleList: [],
    status: 'idle'
}

// 스케줄 검색 타입 정의
type SearchSchedules = {
    today? : string,
    chooseDate? : string
}
// 스케줄 추가 시 타입 정의
type ScheduleList = {
    id?: string;
    today?: string;
    chooseDate?: string;
    schedule: string[];
}

// api 호출 주소
const url = 'http://175.212.136.236:8081/calendar';

// 비동기 액션 생성
// api get
export const fetchSchedules = createAsyncThunk(
    'schedules/fetchSchedules',
    async ({today, chooseDate} : SearchSchedules) => {
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
// 랜덤 아이디 값 생성
const getRandomId = () => {
    const now = new Date();
    const timeStamp = now.getTime();
    const randomNum = Math.floor(Math.random() * 10000)
    return `${timeStamp} - ${randomNum}`
}
export const addSchedules = createAsyncThunk(
    'schedules/addScheduless',
    async ({today, chooseDate, schedule}: ScheduleList) => {
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

// slice 생성
const scheduleSlice = createSlice({
    name: 'schedules',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSchedules.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchSchedules.fulfilled, (state, action) => {
                state.status = 'idle';
                state.scheduleList = action.payload
            })
            .addCase(addSchedules.fulfilled, (state, action) => {
                state.scheduleList.push(action.payload);
            });
    }
})

export default scheduleSlice.reducer;