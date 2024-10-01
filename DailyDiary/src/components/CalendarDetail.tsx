import './CalendarDetail.scss'
import moment from 'moment'
import Button from './Button';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../app/store';
import { addList, fetchLists } from '../features/api/CalendarSlice';

interface CalendarDetailProps {
    selectedDate: Date | null;
    onClose: () => void;
}

const CalendarDetail: React.FC<CalendarDetailProps> = ({ selectedDate, onClose }) => {
    // 스케줄이 담긴 스케줄 리스트
    const [scheduleList, setScheduleList] = useState<string[]>(['']);

    // 스케줄 인풋 값 핸들링
    const handleSchedule = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newScheduleList = [...scheduleList];
        newScheduleList[index] = e.target.value; // 해당 인덱스의 값을 업데이트
        setScheduleList(newScheduleList);
    }

    // 일정 추가
    const addSchedule = () => {
        setScheduleList([...scheduleList, '']); // 빈 문자열을 추가하여 새로운 스케줄 추가
    }

    // 일정 삭제
    const deleteSchedule = (index: number) => {
        const newScheduleList = scheduleList.filter((_, i) => i !== index);
        setScheduleList(newScheduleList);
    }

    // calendar api 호출
    const apiScheduleList = useSelector((state: RootState) => state.schedules.scheduleList)
    const status = useSelector((state: RootState) => state.schedules.status)
    const dispatch = useDispatch<AppDispatch>()

    // 해당 날짜 api list 호출
    const chooseDate = moment(selectedDate).format('YYYY-MM-DD')
    useEffect(() => {
        if(status === 'idle') {
            dispatch(fetchLists({chooseDate}))
        }
    }, [selectedDate])


    const confirmBtn = async () => {
        console.log(chooseDate)
        // dispatch(addList({ date, schedule }));
    }

    return (
        <div className="CalendarDetail mt-4 p-2">
            <section className='row align-items-center justify-content-between m-0 g-0 p-0'>
                {apiScheduleList.map((item) => (
                    <div key={item.date}>
                        {item.schedule}
                        <div>
                            
                        </div>
                    </div>
                ))}
                <h4 className='w-auto m-0'>
                    {selectedDate ? moment(selectedDate).format('YYYY년 MM월 DD일') : '날짜 선택 안됨'}
                </h4>
                <Button 
                    text={'확인'}
                    type='confirm'
                    onClick={() => {
                        confirmBtn()
                        onClose()
                    }}    
                />
            </section>
            <section className='mt-3'>
                <div className='row align-items-center justify-content-between m-0 g-0 p-0'>
                    <h5 className='w-auto'>일정 추가</h5>
                    <Button 
                        text={<FontAwesomeIcon icon={faPlus} />}
                        type='confirm'
                        onClick={addSchedule}   
                    />
                </div>
                <ul className='row align-items-center m-0 g-0 p-0'>
                    {
                        scheduleList.map((schedule, i) => (
                            <li key={i} className='row align-items-center m-0 g-0 gap-1 mt-2'>
                                <input 
                                    type='text' 
                                    className='w-auto m-0 g-0 flex-grow-1'
                                    value={schedule} // 스케줄 리스트에서 해당 인덱스의 값을 사용
                                    onChange={(e) => handleSchedule(e, i)} // 인덱스를 전달하여 개별 인풋 업데이트
                                />
                                <Button 
                                    text={<FontAwesomeIcon icon={faX} />}
                                    type='cancel'
                                    onClick={() => deleteSchedule(i)}  
                                />
                            </li>
                        ))
                    }
                </ul>
            </section>
        </div>
    );
};

export default CalendarDetail;
