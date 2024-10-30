import './CalendarDetail.scss'
import moment from 'moment'
import Button from './Button';
import TodoList from './TodoList';
import ScheduleList from './ScheduleList';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../app/store';
import { addCalendar, addSchedules, addTodoLists, correctSchedule, correctTodo, fetchCalendatList, newSchedule, newTodo, updateSchedule, updateTodos } from '../features/api/CalendarSlice';

import Loading from "../pages/Loading";

interface CalendarDetailProps {
    selectedDate: Date | null;
}

const CalendarDetail: React.FC<CalendarDetailProps> = ({ selectedDate }) => {
    const [isLoading, setIsLoading] = useState(true);

    // 오늘 날짜
    const today = moment(new Date()).format('YYYY-MM-DD')
    // 달력 클릭 날짜
    const chooseDate = moment(selectedDate).format('YYYY-MM-DD')
    // 클릭 된 날짜가 없을 때 오늘 날짜 뜨기 - 처음 페이지 로딩 후
    const dateParam = (!chooseDate || isNaN(new Date(chooseDate).getTime())) ? today : chooseDate;
    const headerDate = moment(dateParam).format('YYYY년 MM월 DD일')

    // api 저장 할 스케줄  
    const [schedule, setSchedule] = useState<string[]>(['']);
    // api 저장 할 to do list
    interface TodoItem {
        checked: boolean,
        content: string
    }
    const [toDoList, setToDoList] = useState<TodoItem[]>([{
        checked: false,
        content: ''
    }])

    // dispatch
    const dispatch = useDispatch<AppDispatch>();
    
    // api 스케줄 체크
    const apiCalendarList = useSelector((state: RootState) => state.calendarLists);
    const apiScheduleList = useSelector((state: RootState) => state.calendarLists.scheduleList)

    // api to do list 체크
    const apiTodoList = useSelector((state: RootState) => state.calendarLists.todoList)

    // api 수정 시
    const apiID= useSelector((state: RootState) => state.calendarLists.id)  // api list id
    const apiDate = useSelector((state: RootState) => state.calendarLists.date);  // api list date

    // 수정 할 리스트
    const [correctionSchedule, setCorrectionSchedule] = useState(apiScheduleList || []); // 스케줄
    const [correctionTodos, setCorrectionTodos] = useState(apiTodoList || [])

    // 비동기 해결, api 호출 시 있는데 담기지 않으면 로딩 되지 않게
    useEffect(() => {
        if (apiScheduleList) {
            setCorrectionSchedule(apiScheduleList || []);
            setIsLoading(false);
        }
        if (apiTodoList) {
            setCorrectionTodos(apiTodoList || [])
            setIsLoading(false);
        }
        // console.log(apiTodoList?.length > 0)
        // console.log(toDoList[0].content != '')
        // console.log(JSON.stringify(apiTodoList) === JSON.stringify(correctionTodos))
    }, [apiTodoList, apiScheduleList])

    // api 스케줄, to do list 저장
    const confirmBtn = () => {
        // calendar api에 기록이 없을 때
        if(apiCalendarList.id == null || apiCalendarList.id == undefined){
            // 스케줄만 추가
            if(schedule[0] != '' && toDoList[0].content == ''){
                dispatch(addSchedules({today, chooseDate, schedule}))
                setSchedule([''])
                dispatch(fetchCalendatList({today, chooseDate}))
                console.log(1)
                return
            }
            // 투 두 리스트만 추가
            if(schedule[0] == '' && toDoList[0].content != ''){
                dispatch(addTodoLists({today, chooseDate, toDoList}))
                setToDoList([{
                    checked: false,
                    content: ''
                }])
                console.log(2)
                return
            }
            // 둘 다 동시에 추가
            if(schedule[0] != '' && toDoList[0].content != ''){
                dispatch(addCalendar({today, chooseDate, schedule, toDoList}))
                setSchedule(['']);
                setToDoList([{
                    checked: false,
                    content: ''
                }]);
                console.log(3)
                return
            }
        // calendar api가 있을 때
        }else if(apiCalendarList.id){
            // 기존 스케줄만 있을 때 투 두 리스트 첫 추가
            if(apiScheduleList?.length > 0 && apiTodoList == undefined && toDoList[0].content != ''){
                dispatch(updateTodos({ apiID, apiDate, apiTodoList, toDoList}))
                setToDoList([{
                    checked: false,
                    content: ''
                }])
                console.log(4)
                return;
            }
            // 기존 투 두 리스트만 있을 때 스케줄 첫 추가
            if(apiTodoList?.length > 0 && apiScheduleList == undefined && schedule[0]!= ''){
                dispatch(updateSchedule({ apiID, apiDate, apiScheduleList, schedule }))
                setSchedule(['']);
                console.log(5)
                return;
            }
            // 스케줄, 투 두 리스트 수정
            if(apiScheduleList.length > 0 && correctionSchedule && schedule[0] == '' && toDoList[0].content == '') {
                dispatch(correctSchedule({ apiID, apiDate, correctionSchedule}))
                dispatch(correctTodo({ apiID, apiDate, correctionTodos, toDoList}))
                setSchedule(['']);
                setToDoList([{
                    checked: false,
                    content: ''
                }])
                console.log(6)
                return;
            }
            // 새 스케줄 추가
            if(apiScheduleList.length > 0 && schedule[0] != '' && JSON.stringify(apiScheduleList) === JSON.stringify(correctionSchedule) && toDoList[0].content == ''){
                dispatch(updateSchedule({ apiID, apiDate, apiScheduleList, schedule }))
                setSchedule(['']);
                console.log(7)
                return;
            }
            // 스케줄 수정 + 새 스케줄 추가
            if(apiScheduleList.length > 0 && correctionSchedule && schedule[0] != ''){
                dispatch(newSchedule({ apiID, apiDate, correctionSchedule, schedule}))
                setSchedule(['']);
                console.log(8)
                return;
            }
            // 스케줄 수정 + 새 스케줄 추가 + 투 두 리스트 수정
            // 스케줄 수정 + 새 스케줄 추가 + 투 두 리스트 추가
            // 스케줄 수정 + 새 스케줄 추가 + 투 두 리스트 수정 + 새 투 두 리스트 추가
            // 투 두 리스트 수정
            // if(apiTodoList.length > 0 && correctionTodos && toDoList[0].content == '' && schedule[0] == '') {
            //     dispatch(correctTodo({ apiID, apiDate, correctionTodos, toDoList}))
            //     setToDoList([{
            //         checked: false,
            //         content: ''
            //     }])
            //     console.log(9)
            //     return
            // }
            // 투 두 리스트 추가
            if(apiTodoList.length > 0 && toDoList[0].content != '' && JSON.stringify(apiTodoList) === JSON.stringify(correctionTodos)) {
                dispatch(updateTodos({ apiID, apiDate, apiTodoList, toDoList}))
                setToDoList([{
                    checked: false,
                    content: ''
                }])
                console.log(9)
                return
            }
            // 투 두 리스트 수정 + 투 두 리스트 추가
            if(apiTodoList.length > 0 && correctionTodos && toDoList[0].content != ''){
                dispatch(newTodo({ apiID, apiDate, correctionTodos, toDoList}))
                setToDoList([{
                    checked: false,
                    content: ''
                }])
                console.log(10)
                return;
            }
        }
        console.log(100)
    }
    
    if (isLoading) {
        return <Loading />
    }

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
                    setSchedule = {setSchedule}
                    correctionSchedule = {correctionSchedule}
                    setCorrectionSchedule = {setCorrectionSchedule}
                />
            </section>
            <section className='mt-3'>
                <TodoList 
                    selectedDate={selectedDate}
                    correctionTodos={correctionTodos}
                    setCorrectionTodos={setCorrectionTodos}
                    toDoList={toDoList}
                    setToDoList={setToDoList}
                />
            </section>
        </div>
    );
};

export default CalendarDetail;
