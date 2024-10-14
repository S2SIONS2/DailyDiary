import Loading from "../pages/Loading";
import Button from "./Button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { fetchSchedules } from "../features/api/CalendarSlice";

import { useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faPlus } from "@fortawesome/free-solid-svg-icons";

import moment from 'moment'

interface ScheduleListProps {
    selectedDate: Date | null;
    schedule: string[] | null;
    setScheduleList: React.Dispatch<React.SetStateAction<string[]>>;
}

const ScheduleList: React.FC<ScheduleListProps> = ({ selectedDate, schedule, setScheduleList }) => {
    const today = moment(new Date()).format('YYYY-MM-DD');
    const chooseDate = moment(selectedDate).format('YYYY-MM-DD');

    const apiCalendarList = useSelector((state: RootState) => state.schedules.scheduleList);
    const apiScheduleList = apiCalendarList.map((item) => item.schedule);
    const status = useSelector((state: RootState) => state.schedules.status);

    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (status === 'idle') {
            if (!chooseDate || isNaN(new Date(chooseDate).getTime())) {
                dispatch(fetchSchedules({ today }));
            } else {
                dispatch(fetchSchedules({ chooseDate }));
            }
        }
    }, [today, chooseDate]);

    const addSchedule = () => {
        setScheduleList([...(schedule || []), '']);
    };

    const deleteSchedule = (i: number) => {
        setScheduleList((prev) => prev.filter((_, index) => index !== i));
    };

    const onChangeSchedule = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const newScheduleList = [...schedule || []];
        newScheduleList[i] = e.target.value
        setScheduleList(newScheduleList)
    }

    const deleteApi = (i: number) => {
        alert('API 일정 삭제 버튼');
    };

    useEffect(() => {
        console.log(schedule)
    }, [])

    if (status === 'loading') {
        return <Loading />;
    }

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
                    apiScheduleList && apiScheduleList.map((item: string[], index) => (
                        item.map((subItem, subIndex) => (
                            <li className='row align-items-center m-0 g-0 gap-1 mt-2 apischedule' key={`${index}-${subIndex}`}>
                                <input
                                    type='text'
                                    className='w-auto m-0 g-0 ps-1 flex-grow-1'
                                    value={subItem || ''}
                                    readOnly
                                />
                                <Button
                                    text={<FontAwesomeIcon icon={faX} />}
                                    type='cancel'
                                    onClick={() => deleteApi(index)}
                                />
                            </li>
                        ))
                    ))
                }

            </ul>
        </div>
    );
};

export default ScheduleList;
