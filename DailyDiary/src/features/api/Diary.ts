import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

interface Diary {
    id: string,
    diaryTitle: string,
    date: string,
    emotion: string,
    description: string
}
interface DiaryState {
    saveDiary: Diary[]
    status: 'idle' | 'loading' | 'failed'
}
const initialState: DiaryState = {
    saveDiary: [],
    status: 'idle'
}

// 타입 지정
type CreateDiary = {
    diaryTitle: string,
    date: string,
    emotion: string,
    description: string
}

// api 주소
const url = 'http://175.212.136.236:8081/diary';

// 비동기 액션 생성
// api get
export const fetchDiarys = createAsyncThunk(
    'diarys/fetchDiarys',
    async () => {
        const response = await axios.get(url);
        return response.data;
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
export const createDiary = createAsyncThunk(
    'diarys/createDiary',
    async({ diaryTitle, date, emotion, description }: CreateDiary) => {
        const params = {
            id: getRandomId(),
            date: date,
            diaryTitle: diaryTitle,
            emotion: emotion,
            description: description
        }
        const response = await axios.post(url, params)
        return response.data
    }
)

// api put
export const correctDiary = createAsyncThunk(
    'diarys/correctDiary',
    async({ id, diaryTitle, date, emotion, description}: Diary) => {
        const params = {
            id: id,
            date: date,
            diaryTitle: diaryTitle,
            emotion: emotion,
            description: description
        }
        const response = await axios.put(url + `/${id}`, params)
        return response.data;
    }
)

// api delete
export const deleteDiary = createAsyncThunk(
    'diarys/deleteDiary',
    async({id}: {id: string}) => {
        await axios.delete(url + `/${id}`)
        return id;
    }
)

const diarySlice = createSlice({
    name: 'diary',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDiarys.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchDiarys.fulfilled, (state, action) => {
                state.status = 'idle';
                state.saveDiary = action.payload
            })
            .addCase(createDiary.fulfilled, (state, action)=>{
                state.saveDiary = action.payload;
            })
            .addCase(correctDiary.fulfilled, (state, action)=>{
                state.saveDiary = action.payload;
            })
            .addCase(deleteDiary.fulfilled, (state, action)=>{
                state.saveDiary = state.saveDiary.filter((list) => list.id !== action.payload);
            })
    }
})

export default diarySlice.reducer;