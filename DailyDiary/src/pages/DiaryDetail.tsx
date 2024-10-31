import { useState } from 'react';
import Button from '../components/Button';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { correctDiary, deleteDiary } from '../features/api/Diary';
import { AppDispatch } from '../app/store';

const DiaryDetail: React.FC = () => {
    const location = useLocation();
    const { item } = location.state || {};
    
    const id = item?.id ?? '';
    const [diaryTitle, setDiaryTitle] = useState(item?.diaryTitle || '');
    const [date, setDate] = useState(item?.date || '');
    const [emotion, setEmotion] = useState(item?.emotion || '');
    const [description, setDescription] = useState(item?.description || '');

    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const confirmBtn = () => {
        dispatch(correctDiary({ id, diaryTitle, date, emotion, description }));
        navigate('/app/diary');
    };

    const cancelBtn = () => {
        navigate('/app/diary');
    };

    const removeBtn = () => {
        if (window.confirm('일기가 삭제됩니다. 진행 하시겠습니까?')) {
            dispatch(deleteDiary({ id }));
            navigate('/app/diary');
        }
    };

    return (
        <div className="DiaryDetail">
            <div className="row align-items-center justify-content-between mb-3 g-0 w-100">
                <h3 className="w-auto row align-items-center mb-0">
                    <input type="text" value={diaryTitle} onChange={(e) => setDiaryTitle(e.target.value)} />
                </h3>
                <Button text="삭제" onClick={removeBtn} type="confirm" />
            </div>
            <section className="row m-0 mb-3 pb-3 border-bottom">
                <h4 className="p-0">날짜</h4>
                <input type="date" className="w-auto me-2 flex-grow-1" value={date} onChange={(e) => setDate(e.target.value)} />
            </section>
            <section className="row m-0 mb-3 pb-3 border-bottom">
                <h4 className="p-0">감정</h4>
                <select value={emotion} onChange={(e) => setEmotion(e.target.value)}>
                    <option value="행복">행복</option>
                    <option value="신남">신남</option>
                    <option value="화남">화남</option>
                    <option value="슬픔">슬픔</option>
                    <option value="후회">후회</option>
                </select>
            </section>
            <section className="row m-0 mb-3">
                <h4 className="p-0">일기장</h4>
                <textarea className="w-auto flex-grow-1" value={description} onChange={(e) => setDescription(e.target.value)} />
            </section>
            <section className="row align-items-center justify-content-center gap-2 m-0 mb-3">
                <Button text="닫기" onClick={cancelBtn} type="cancel" />
                <Button text="수정" onClick={confirmBtn} type="confirm" />
            </section>
        </div>
    );
};

export default DiaryDetail;
