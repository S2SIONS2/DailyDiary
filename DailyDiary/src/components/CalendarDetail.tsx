import './CalendarDetail.scss'
import moment from 'moment'
import Button from './Button';
import Loading from '../pages/Loading';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../app/store';
import { addList, deleteList, fetchLists, updateList, correctList } from '../features/api/CalendarSlice';

interface CalendarDetailProps {
    selectedDate: Date | null;
}

const CalendarDetail: React.FC<CalendarDetailProps> = ({ selectedDate }) => {
    // calendar api 호출
    const apiData = useSelector((state: RootState) => state.schedules.scheduleList)
    const status = useSelector((state: RootState) => state.schedules.status)
    const dispatch = useDispatch<AppDispatch>()

    // 클릭한 날짜 api list 호출
    const today = moment(new Date()).format('YYYY-MM-DD') // 오늘 날짜
    const chooseDate = moment(selectedDate).format('YYYY-MM-DD')// 달력 클릭 날짜
    const dateParam = (!chooseDate || isNaN(new Date(chooseDate).getTime())) ? today : chooseDate;
    const selectedSchedules = apiData.find(item => item.date === chooseDate); // api list 중 클릭한 날짜와 동일한 날짜의 리스트
    const todaySchedules = apiData.find(item => item.date === today); // api list 중 클릭한 날짜와 동일한 날짜의 리스트
    // 동일 날짜 리스트 중 새로 고침 시 오늘 일정으로 고정
    const apiScheduleList = selectedSchedules?.schedule !== undefined ? selectedSchedules?.schedule : todaySchedules?.schedule
    const apiId = selectedSchedules?.id // api list id
    const apiDate = selectedSchedules?.date // api list date

    // 해당 날짜의 스케줄 리스트를 가져오는 로직
    useEffect(() => {
        if (status === 'idle') {
            if(!chooseDate || isNaN(new Date(chooseDate).getTime())){
                dispatch(fetchLists({ today }))
            }else{
                dispatch(fetchLists({ chooseDate }))
            }
        }
    }, [today, chooseDate]);

    // 추가 할 스케줄이 담긴 스케줄 리스트
    const [scheduleList, setScheduleList] = useState<string[]>([]);

    // 추가 스케줄 인풋 값 핸들링
    const handleSchedule = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newScheduleList = [...scheduleList];
        newScheduleList[index] = e.target.value;
        setScheduleList(newScheduleList);
    }

    // 일정 추가
    const addSchedule = () => {
        setScheduleList([...scheduleList, '']);
    }

    // 일정 삭제 - 페이지에서O, api X
    const deleteSchedule = (index: number) => {
        const newScheduleList = scheduleList.filter((_, i) => i !== index);
        setScheduleList(newScheduleList);
    }
    // 일정 삭제 - 페이지에서 X, api O
    const deleteApi = (index: number) => {
        if(confirm('일정이 삭제 됩니다. 삭제 하시겠습니까?') == true){
            const newScheduleList = apiScheduleList != undefined ? apiScheduleList.filter((_, i) => i !== index) : apiScheduleList;
            dispatch(deleteList({apiId, apiDate, newScheduleList}))
        }
    }

    // 일정 수정
    const [correctSchedule, setCorrectSchedule] = useState(apiScheduleList || []);
    useEffect(() => {
        setCorrectSchedule(apiScheduleList || []);
    }, [apiScheduleList]);

    // input 일정 수정 핸들링
    const handleScheduleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newCorrectSchedule = [...correctSchedule];
        newCorrectSchedule[index] = e.target.value;
        setCorrectSchedule(newCorrectSchedule);
    };

    // api post (추가)
    const confirmBtn = async () => {
        if (selectedSchedules && scheduleList.length > 0) {
            // alert('추가? 입니다.');
            dispatch(updateList({apiId, apiDate, apiScheduleList, scheduleList}))
        }else if(selectedSchedules) {
            dispatch(correctList({apiId, apiDate, correctSchedule, scheduleList}))
        }
         else {
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
                    {dateParam ? moment(dateParam).format('YYYY년 MM월 DD일') : '날짜 선택이 안되었습니다.'}
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
                        !apiScheduleList && '일정이 없습니다.'
                    }
                    {
                        scheduleList.map((schedule, i) => (
                            <li key={i} className='row align-items-center m-0 g-0 gap-1 mt-2'>
                                <input 
                                    type='text' 
                                    className='w-auto m-0 g-0 flex-grow-1'
                                    value={schedule}
                                    onChange={(e) => handleSchedule(e, i)}
                                    placeholder={'추가 할 일정을 작성 해주세요.'}
                                />
                                <Button 
                                    text={<FontAwesomeIcon icon={faX} />}
                                    type='cancel'
                                    onClick={() => deleteSchedule(i)}  
                                />
                            </li>
                        ))
                    }
                    {
                        apiScheduleList && apiScheduleList.map((_, i) => (
                            <li key={i} className='row align-items-center m-0 g-0 gap-1 mt-2'>
                                <input 
                                    type='text' 
                                    className='w-auto m-0 g-0 flex-grow-1'
                                    value={correctSchedule[i] || ''}
                                    onChange={(e) => handleScheduleChange(e, i)}
                                    // placeholder={schedule}
                                />
                                <Button 
                                    text={<FontAwesomeIcon icon={faX} />}
                                    type='cancel'
                                    onClick={() => deleteApi(i)}  
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
