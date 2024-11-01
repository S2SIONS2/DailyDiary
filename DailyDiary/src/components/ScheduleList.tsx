import Button from "./Button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { fetchCalendatList, deleteScheduleList } from "../features/api/CalendarSlice";

import { useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faPlus } from "@fortawesome/free-solid-svg-icons";

import moment from 'moment'

interface ScheduleListProps {
    selectedDate: Date | null;
    schedule: string[] | null;
    setSchedule: React.Dispatch<React.SetStateAction<string[]>>;
    correctionSchedule: string[]
    setCorrectionSchedule: React.Dispatch<React.SetStateAction<string[]>>;
}

const ScheduleList: React.FC<ScheduleListProps> = ({ selectedDate, schedule, setSchedule, correctionSchedule, setCorrectionSchedule }) => {
    // api 선택 날짜
    const today = moment(new Date()).format('YYYY-MM-DD');
    const chooseDate = moment(selectedDate).format('YYYY-MM-DD');
    // api list
    const apiScheduleList = useSelector((state: RootState) => state.calendarLists.scheduleList);
    const status = useSelector((state: RootState) => state.calendarLists.status);
    const dispatch = useDispatch<AppDispatch>();
    // api list id
    const apiID = useSelector((state: RootState) => state.calendarLists.id) 
    
    // api 호출
    useEffect(() => {
        if (status === 'idle') {
            if (!chooseDate || isNaN(new Date(chooseDate).getTime())) {
                dispatch(fetchCalendatList({ today }));
            } else {
                dispatch(fetchCalendatList({ chooseDate }));
            }
        }
        
    }, [today, chooseDate]);

    // api 추가 할 로컬 스케줄
    const addSchedule = () => {
        setSchedule([...(schedule || []), '']);
    };
    // 로컬 스케줄 삭제
    const deleteSchedule = (i: number) => {
        setSchedule((prev) => prev.filter((_, index) => index !== i));
    };
    // 스케줄 인풋 핸들링
    const onChangeSchedule = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const newScheduleList = [...schedule || []];
        newScheduleList[i] = e.target.value
        setSchedule(newScheduleList)
    }

    // 기존 스케줄(api 스케줄) 수정 시
    const handleSchedule = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newCorrectSchedule = [...correctionSchedule || []]
        newCorrectSchedule[index] = e.target.value
        setCorrectionSchedule(newCorrectSchedule)
    };
    // api
    const deleteApi = (i: number) => {
        if( confirm('일정이 삭제됩니다. 진행 하시겠습니까?') == true){
            dispatch(deleteScheduleList({ apiID, apiScheduleList, i }))
        }
    };

    return (
        <div className="ScheduleList">
            <div className='row align-items-center justify-content-between m-0 g-0 p-0'>
                <h5 className='w-auto'>일정 추가</h5>
                <Button
                    text={<FontAwesomeIcon icon={faPlus} />}
                    type='confirm'
                    onClick={addSchedule}
                />
            </div>
            <ul className='row align-items-center m-0 g-0 p-0'>
                {(!apiScheduleList || apiScheduleList.length === 0) && '일정이 없습니다.'}

                {schedule && schedule.map((schedule, i) => (
                    <li key={i} className='row align-items-center m-0 g-0 gap-1 mt-2 schedule'>
                        <input
                            type='text'
                            className='w-auto m-0 g-0 ps-1 flex-grow-1'
                            value={schedule}
                            placeholder={'추가 할 일정을 작성 해주세요.'}
                            onChange={(e) => onChangeSchedule(i,e)}
                        />
                        <Button
                            text={<FontAwesomeIcon icon={faX} />}
                            type='cancel'
                            onClick={() => deleteSchedule(i)}
                        />
                    </li>
                ))}
                {
                    apiScheduleList && apiScheduleList.length > 0 && apiScheduleList.map((_, index) => (
                        <li key={index} className="mt-2 w-100 row align-items-center gap-2 p-0 g-0">
                            <input
                                type='text'
                                className='w-auto m-0 g-0 ps-1 flex-grow-1'
                                value={correctionSchedule[index] || ''}
                                onChange={(e) => handleSchedule(e, index)}
                            />
                            <Button
                                text={<FontAwesomeIcon icon={faX} />}
                                type='cancel'
                                onClick={() => deleteApi(index)}
                            />
                        </li>
                    ))
                }
            </ul>
        </div>
    );
};

export default ScheduleList;
