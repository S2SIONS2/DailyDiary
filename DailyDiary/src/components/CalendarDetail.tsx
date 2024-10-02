import './CalendarDetail.scss'
import moment from 'moment'
import Button from './Button';
import Loading from '../pages/Loading';

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
    // calendar api 호출
    const apiData = useSelector((state: RootState) => state.schedules.scheduleList)
    const status = useSelector((state: RootState) => state.schedules.status)
    const dispatch = useDispatch<AppDispatch>()

    // 클릭한 날짜 api list 호출
    const chooseDate = moment(selectedDate).format('YYYY-MM-DD') // 달력 클릭 날짜
    const selectedSchedules = apiData.find(item => item.date === chooseDate); // api list 중 클릭한 날짜와 동일한 날짜의 리스트
    const apiScheduleList = selectedSchedules?.schedule // 동일 날짜 리스트 중 스케줄 리스트

    // 해당 날짜의 스케줄 리스트를 가져오는 로직
    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchLists({ chooseDate }))
        }
    }, [chooseDate]);

    // 추가 할 스케줄이 담긴 스케줄 리스트
    const [scheduleList, setScheduleList] = useState(apiScheduleList || '')
    
    // 스케줄 인풋 값 핸들링
    const handleSchedule = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newScheduleList = [...scheduleList];
        newScheduleList[index] = e.target.value;
        setScheduleList(newScheduleList);
    }

    // 리스트 추가
    const confirmBtn = async () => {
        if (selectedSchedules) {
            alert('이미 있는 일정입니다.');
        } else {
            dispatch(addList({ chooseDate, scheduleList }));
        }
    }

    // api list 로딩중일때
    if (status === 'loading') {
        return (
            <Loading />
        );
    }

    return (
        <div className="CalendarDetail mt-4 p-2">
            <section className='row align-items-center justify-content-between m-0 g-0 p-0'>
                <h4 className='w-auto m-0'>
                    {selectedDate ? moment(selectedDate).format('YYYY년 MM월 DD일') : '날짜 선택 안됨'}
                </h4>
                <Button 
                    text={'확인'}
                    type='confirm'
                    onClick={() => {
                        confirmBtn();
                        onClose();
                    }}    
                />
            </section>
            <section className='mt-3'>
                <div className='row align-items-center justify-content-between m-0 g-0 p-0'>
                    <h5 className='w-auto'>일정 추가</h5>
                    <Button 
                        text={<FontAwesomeIcon icon={faPlus} />}
                        type='confirm'
                        // onClick={addSchedule}   
                    />
                </div>
                <ul className='row align-items-center m-0 g-0 p-0'>
                    {
                        apiScheduleList && apiScheduleList.map((schedule, i) => (
                            <li key={i} className='row align-items-center m-0 g-0 gap-1 mt-2'>
                                <input 
                                    type='text' 
                                    className='w-auto m-0 g-0 flex-grow-1'
                                    value={schedule || scheduleList}
                                    onChange={(e) => handleSchedule(e, i)}
                                    // placeholder={schedule}
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
