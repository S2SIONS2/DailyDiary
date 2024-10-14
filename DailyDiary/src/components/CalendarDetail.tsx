import './CalendarDetail.scss'
import moment from 'moment'
import Button from './Button';
import TodoList from './TodoList';
import ScheduleList from './ScheduleList';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../app/store';
import { addSchedules } from '../features/api/CalendarSlice';

interface CalendarDetailProps {
    selectedDate: Date | null;
    // todayValue: string | null;
}

const CalendarDetail: React.FC<CalendarDetailProps> = ({ selectedDate }) => {
    // 오늘 날짜
    const today = moment(new Date()).format('YYYY-MM-DD')
    // 달력 클릭 날짜
    const chooseDate = moment(selectedDate).format('YYYY-MM-DD')
    // 클릭 된 날짜가 없을 때 오늘 날짜 뜨기 - 처음 페이지 로딩 후
    const dateParam = (!chooseDate || isNaN(new Date(chooseDate).getTime())) ? today : chooseDate;
    const headerDate = moment(dateParam).format('YYYY년 MM월 DD일')
    // api 저장 할 스케줄 추가 
    const [schedule, setSchedule] = useState<string[]>([]);
    const dispatch = useDispatch<AppDispatch>();
    
    // api 스케줄 체크
    const apiCalendarList = useSelector((state: RootState) => state.schedules.scheduleList);
    const apiScheduleList = apiCalendarList.map((item) => item.schedule);
    // api 스케줄 저장
    const confirmBtn = () => {
        // api 스케줄이 없고 날짜가 오늘 일 때
        alert('1')
        if(apiScheduleList.length == 0 && schedule){
            alert('2')
            dispatch(addSchedules({ today, chooseDate, schedule }))
        }
    }

    useEffect(() => {
        console.log(apiScheduleList)
        console.log(schedule)
    }, [schedule])

    return (
        <div className="CalendarDetail h-100 p-2">
            <section className='row align-items-center justify-content-between m-0 g-0 p-0'>
                <h4 className='w-auto m-0'>
                    {headerDate}
                </h4>
                <Button 
                    text={'확인'}
                    type='confirm'
                    onClick={() => {
                        confirmBtn();
                    }}    
                />
            </section>
            <section className='mt-3'>
                <ScheduleList 
                    selectedDate={selectedDate}
                    schedule = {schedule}
                    setScheduleList = {setSchedule}
                />
            </section>
            <section className='mt-3'>
                <TodoList 
                    selectedDate={selectedDate}
                />
            </section>
        </div>
    );
};

export default CalendarDetail;
