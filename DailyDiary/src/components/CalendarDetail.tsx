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
    }, [apiTodoList, apiScheduleList])

    // api 스케줄, to do list 저장
    const confirmBtn = async () => {
        // API 여부 체크
        const hasApiCalendarListId = apiCalendarList.id != null;

        // API 스케줄 존재 여부
        const hasApiScheduleList = apiScheduleList && apiScheduleList.length > 0;
        // API 투두 리스트 존재 여부
        const hasApiTodoList = apiTodoList && apiTodoList.length > 0;

        // api 스케줄이 있으나 [] 일 때
        const emptyApiSchedule = apiScheduleList?.length == 0
        // api 투 두 리스트가 있으나 [] 일 때
        // const emptyApiTodoList = apiTodoList?.length == 0

        // 추가 스케줄 추가 여부
        const hasSchedule = schedule[0] !== '';
        // 추가 투두 리스트 추가 여부
        const hasToDoList = toDoList[0].content !== '';

        // 스케줄이 수정되었을 때
        const isScheduleChanged =
          JSON.stringify(apiScheduleList) !== JSON.stringify(correctionSchedule);
        // 투두 리스트가 수정되었을 때
        const isTodoChanged =
          JSON.stringify(apiTodoList) !== JSON.stringify(correctionTodos);
      
        const resetForm = async () => {
          setSchedule(['']);
          setToDoList([{ checked: false, content: '' }]);
          await dispatch(fetchCalendatList({ today, chooseDate }));
        };
      
        // Calendar API에 기록이 없을 때
        if (!hasApiCalendarListId) {
          if (hasSchedule && !hasToDoList) {
            // 스케줄만 추가
            await dispatch(addSchedules({ today, chooseDate, schedule }));
          } else if (!hasSchedule && hasToDoList) {
            // 투두 리스트만 추가
            await dispatch(addTodoLists({ today, chooseDate, toDoList }));
          } else if (hasSchedule && hasToDoList) {
            // 둘 다 추가
            await dispatch(addCalendar({ today, chooseDate, schedule, toDoList }));
          }
          await resetForm();
          return;
        }
      
        // Calendar API에 기록이 있을 때
        if (
          hasApiScheduleList &&
          !hasApiTodoList &&
          hasToDoList &&
          correctionSchedule &&
          hasSchedule
        ) {
          // 스케줄 수정 + 투두 리스트 첫 추가
          await dispatch(
            newSchedule({ apiID, apiDate, correctionSchedule, schedule })
          );
          await dispatch(updateTodos({ apiID, apiDate, apiTodoList, toDoList }));
        } else if (hasApiScheduleList && !hasApiTodoList && hasToDoList) {
          // 기존 스케줄만 있고 투두 리스트 첫 추가
          await dispatch(updateTodos({ apiID, apiDate, apiTodoList, toDoList }));
        } else if(emptyApiSchedule && hasSchedule && !isTodoChanged && !hasToDoList) {
          // 비어있는 스케줄 리스트가 있을 때
          await dispatch(updateSchedule({ apiID, apiDate, apiScheduleList, schedule }));
          await resetForm();
          return;
        }else if (hasApiTodoList && !hasApiScheduleList && hasSchedule && !isTodoChanged && !hasToDoList) {
          // 기존 투두 리스트만 있고 스케줄 첫 추가
          await dispatch(updateSchedule({ apiID, apiDate, apiScheduleList, schedule }));
        }else if (hasApiTodoList && !hasApiScheduleList && hasSchedule && !isTodoChanged){
            // 기존 투두 리스트만 있고 스케줄 첫 추가 및 투 두 리스트 추가
            await dispatch(updateSchedule({ apiID, apiDate, apiScheduleList, schedule }));
            await dispatch(updateTodos({ apiID, apiDate, apiTodoList, toDoList}))
        } else if (
          hasApiScheduleList &&
          correctionSchedule &&
          !hasSchedule &&
          !hasToDoList
        ) {
          // 스케줄 및 투두 리스트 수정
          await dispatch(correctSchedule({ apiID, apiDate, correctionSchedule }));
          await dispatch(correctTodo({ apiID, apiDate, correctionTodos, toDoList }));
        } else if (
          hasApiScheduleList &&
          hasSchedule &&
          !isScheduleChanged &&
          !hasToDoList
        ) {
          // 스케줄 추가 및 투두 리스트 수정
          await dispatch(
            updateSchedule({ apiID, apiDate, apiScheduleList, schedule })
          );
          await dispatch(correctTodo({ apiID, apiDate, correctionTodos, toDoList }));
        } else if (
          hasApiScheduleList &&
          correctionSchedule &&
          hasSchedule &&
          !hasToDoList
        ) {
          // 스케줄 수정 및 추가, 투두 리스트 수정
          await dispatch(newSchedule({ apiID, apiDate, correctionSchedule, schedule }));
          await dispatch(correctTodo({ apiID, apiDate, correctionTodos, toDoList }));
        } else if (
          hasApiScheduleList &&
          hasSchedule &&
          !isScheduleChanged &&
          hasToDoList &&
          !isTodoChanged
        ) {
          // 스케줄 및 투두 리스트 추가
          console.log(8)
          await dispatch(updateSchedule({ apiID, apiDate, apiScheduleList, schedule }));
          await dispatch(updateTodos({ apiID, apiDate, apiTodoList, toDoList }));
        } else if (
          hasApiScheduleList &&
          isScheduleChanged &&
          hasSchedule &&
          hasToDoList
        ) {
          // 스케줄 수정 및 추가, 투두 리스트 추가
          await dispatch(newSchedule({ apiID, apiDate, correctionSchedule, schedule }));
          await dispatch(updateTodos({ apiID, apiDate, apiTodoList, toDoList }));
        } else if (hasApiTodoList && hasToDoList && !isTodoChanged && !isScheduleChanged) {
          // 투두 리스트 추가
          await dispatch(updateTodos({ apiID, apiDate, apiTodoList, toDoList }));
        } else if (
          hasApiTodoList &&
          correctionTodos &&
          hasToDoList &&
          isScheduleChanged &&
          !hasSchedule
        ) {
          // 투두 리스트 수정 및 추가, 스케줄 수정
          await dispatch(newTodo({ apiID, apiDate, correctionTodos, toDoList }));
          await dispatch(correctSchedule({ apiID, apiDate, correctionSchedule }));
        } else if (hasApiTodoList && correctionTodos && hasToDoList) {
          // 스케줄 및 투두 리스트 수정 및 추가
          await dispatch(newSchedule({ apiID, apiDate, correctionSchedule, schedule }));
          await dispatch(newTodo({ apiID, apiDate, correctionTodos, toDoList }));
        } else if (
          (!hasApiScheduleList || apiScheduleList.length === 0) &&
          (!hasApiTodoList || apiTodoList.length === 0)
        ) {
          // 기존 데이터 삭제 후 스케줄과 투두 리스트가 비어있을 때
          await dispatch(updateSchedule({ apiID, apiDate, apiScheduleList, schedule }));
          await dispatch(updateTodos({ apiID, apiDate, apiTodoList, toDoList }));
        }else if(isTodoChanged && !isScheduleChanged && !hasSchedule && !hasToDoList) {
          // 투 두 리스트 수정 시
          await dispatch(correctTodo({ apiID, apiDate, correctionTodos, toDoList}))
        } else if(correctionTodos && toDoList){
          await dispatch(correctTodo({ apiID, apiDate, correctionTodos, toDoList }));
        }else if (!hasApiScheduleList || apiScheduleList.length === 0) {
          // 기존 데이터 삭제 후 스케줄이 비어있을 때 스케줄 추가
          await dispatch(updateSchedule({ apiID, apiDate, apiScheduleList, schedule }));
        } else if (!hasApiTodoList || apiTodoList.length === 0) {
          // 기존 데이터 삭제 후 투두 리스트가 비어있을 때
          await dispatch(updateTodos({ apiID, apiDate, apiTodoList, toDoList }));
        }
        await resetForm();
      };
    
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
