import { useState } from 'react';
import moment from 'moment'
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../app/store';
import { createDiary } from '../features/api/Diary';

const WriteDiary: React.FC = () => {
    // 일기 제목
    const [diaryTitle, setDiaryTitle] = useState('')
    const handleDiaryTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDiaryTitle(e.target.value);
    }
    // 날짜
    const [date, setDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
    const handleDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDate(e.target.value);
    }
    // 오늘의 감정
    const [emotion, setEmotion] = useState('행복');
    const handleEmotion = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setEmotion(e.target.value)
    }
    // 일기 내용
    const [description, setDescription] = useState('')
    const handleDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
    }

    // api 저장
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const confirmBtn = async () => {
        dispatch(createDiary({diaryTitle, date, emotion, description}))
        navigate('/app/diary')  
    }
    // 닫기 버튼 클릭 시
    const cancleBtn = async () => {
        navigate('/app/diary')
    }
    return(
        <div className="WriteDiary">
            <section className='row m-0 mb-3 pb-3 border-bottom'>
                <h4 className='p-0'>일기 제목</h4>
                <input type='text' className='w-auto me-2 flex-grow-1' value={diaryTitle} onChange={handleDiaryTitle}/>
            </section>
            <section className='row m-0 mb-3 pb-3 border-bottom'>
                <h4 className='p-0'>날짜</h4>
                <input type='date' className='w-auto me-2 flex-grow-1' value={date} onChange={handleDate}/>
            </section>
            <section className='row m-0 mb-3 pb-3 border-bottom'>
                <h4 className='p-0'>오늘의 감정</h4>
                <select value={emotion} onChange={handleEmotion}>
                    <option value="행복">행복</option>
                    <option value="신남">신남</option>
                    <option value="화남">화남</option>
                    <option value="슬픔">슬픔</option>
                    <option value="후회">후회</option>
                </select>
            </section>
            <section className='row m-0 mb-3'>
                <h4 className='p-0'>일기장</h4>
                <textarea className='w-auto flex-grow-1' value={description} onChange={handleDescription}/>
            </section>
            <section className='row align-items-center justify-content-center gap-2 m-0 mb-3'>
                <Button
                    text={'닫기'}
                    onClick={() => cancleBtn()}
                    type={'cancle'}
                />
                <Button
                    text={'저장'}
                    onClick={() => confirmBtn()}
                    type={"confirm"}
                />
            </section>
        </div>
    )
}
export default WriteDiary;