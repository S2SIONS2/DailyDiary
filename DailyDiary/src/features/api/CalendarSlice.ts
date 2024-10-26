import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

// 스케줄 api
interface Schedule {
    id: string,
    date: string,
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
// 기존 스케줄 수정 시 타입 정의
type correctSchedule = {
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

// 타입 삭제 시
type DeleteSchedule = {
    apiID?: string | undefined,
    apiScheduleList: string[][]
    subIndex: number
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

// api 기존 스케줄 수정
export const correctSchedule = createAsyncThunk(
    'schedules/correctSchedule',
    async ({ apiID, apiDate, correctionSchedule = [] }: correctSchedule) => {
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
    'schedules/updateSchedule',
    async ({ apiID, apiDate, apiScheduleList, schedule }: UpdateSchedule) => {
        const updatedSchedule = [...apiScheduleList[0] || [], ...schedule]
        const params = {
            id: apiID,
            date: apiDate,
            schedule: updatedSchedule
        }
        const response = await axios.patch(url + `/${apiID}`, params)
        return response.data
    }
)

// 기존 api 수정과 추가 동시에 이루어질 때
export const newSchedule = createAsyncThunk(
    'schedules/newSchedule',
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

// api 삭제 시
export const deleteScheduleList = createAsyncThunk(
    'schedules/deleteSchedule',
    async ({ apiID, apiScheduleList, subIndex }: DeleteSchedule) => {
        const newScheduleList =  apiScheduleList[0].filter((_, index) => index !== subIndex);
        const params = {
            id: apiID,
            schedule: newScheduleList
        };
        const response = await axios.patch(url + `/${apiID}`, params)

        return response.data;
    }
);

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
            })
            .addCase(updateSchedule.fulfilled, (state, action) => {
                state.scheduleList = [action.payload];
            })
            .addCase(newSchedule.fulfilled, (state, action) => {
                state.scheduleList = [action.payload];
            })
            .addCase(deleteScheduleList.fulfilled, (state, action) => { // 삭제 시 화면에 삭제 리스트 제외하고 띄움
                const updatedSchedule = action.payload;
                const index = state.scheduleList.findIndex((schedule) => schedule.id === action.payload.id);
                state.scheduleList = [
                    ...state.scheduleList.slice(0, index),
                    updatedSchedule,
                    ...state.scheduleList.slice(index + 1),
                ];
            })
    }
})

export default scheduleSlice.reducer;