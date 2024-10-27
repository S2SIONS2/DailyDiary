import './TodoList.scss'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../app/store'
import { fetchCalendatList } from '../features/api/CalendarSlice'

import moment from 'moment'
import Button from './Button'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faPlus } from "@fortawesome/free-solid-svg-icons";

interface TodoItem {
    checked: boolean,
    content: string
}

interface TodoListProps {
    selectedDate: Date | null;
    toDoList:TodoItem[] | null;
    setToDoList:React.Dispatch<React.SetStateAction<TodoItem[]>>;
    correctionTodos: TodoItem[];
    setCorrectionTodos: React.Dispatch<React.SetStateAction<TodoItem[]>>;
}

const TodoList: React.FC<TodoListProps> = ({ selectedDate, toDoList, setToDoList, correctionTodos, setCorrectionTodos }, ) => {
    
    const today = moment(new Date()).format('YYYY-MM-DD');
    const chooseDate = moment(selectedDate).format('YYYY-MM-DD');

    const dispatch = useDispatch<AppDispatch>();

    const status = useSelector((state: RootState) => state.calendarLists.status);

    // api to do list 체크
    const apiTotalTodoList = useSelector((state: RootState) => state.calendarLists.todoList)

    useEffect(() => {
        if (status === 'idle') {
            if (!chooseDate || isNaN(new Date(chooseDate).getTime())) {
                dispatch(fetchCalendatList({ today }));
            } else {
                dispatch(fetchCalendatList({ chooseDate }));
            }
        }
    }, [today, chooseDate]);

    const addTodos = () => {
        setToDoList([
            ...toDoList || [],
            { checked: false, content: '' }
        ])
    }
    // 새로 추가 한 체크, 컨텐츠 내용 수정
    const onChangeChecked = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newTodos = [...toDoList || []];
        newTodos[index].checked = e.target.checked
        setToDoList(newTodos)
    }
    const onChangeContents = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newTodos = [...toDoList || []];
        newTodos[index].content = e.target.value
        setToDoList(newTodos)
    }

    // 기존 api 체크, 컨텐츠 수정
    const handleTodoCheck= (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newTodos = correctionTodos.map((todo, i) =>
            i === index ? { ...todo, checked: e.target.checked } : todo
        );
        setCorrectionTodos(newTodos)
    }
    const handleTodoContent = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newTodos = correctionTodos.map((todo, i) =>
            i === index ? { ...todo, content: e.target.value } : todo
        );
        setCorrectionTodos(newTodos)
    }


    return (
        <div className="TodoList">
            <div className='row align-items-center justify-content-between m-0 g-0 p-0'>
                <h5 className='w-auto'>할 일 목록</h5>
                <Button
                    text={<FontAwesomeIcon icon={faPlus} />}
                    type='confirm'
                    onClick={addTodos}
                />
            </div>
            {
                toDoList && toDoList.map((item, index) => (
                    <li key={index} className='row align-items-center m-0 g-0 gap-1 mt-2'>
                        <input 
                            type='checkbox'
                            className='m-0 g-0'
                            checked={item.checked}
                            onChange={(e) => onChangeChecked(e, index)}
                        />
                        <input
                            type='text'
                            className='w-auto m-0 g-0 ps-1 flex-grow-1'
                            placeholder='오늘의 할 일 목록은 무엇인가요?'
                            value={item.content || ''}
                            onChange={(e) => onChangeContents(e, index)}
                        />
                        <Button
                            text={<FontAwesomeIcon icon={faX} />}
                            type='cancel'
                            onClick={() => deleteApi(index)}
                        />
                    </li>
                ))
            }
            {
                apiTotalTodoList?.length > 0 && apiTotalTodoList.map((_, index) => (
                    <li className='row align-items-center m-0 g-0 gap-1 mt-2 apischedule' key={index}>
                        <input 
                            type='checkbox'
                            className='m-0 g-0'
                            checked={correctionTodos[index]?.checked || false}
                            onChange={(e) => handleTodoCheck(e, index)}
                        />
                        <input
                            type='text'
                            className='w-auto m-0 g-0 ps-1 flex-grow-1'
                            value={correctionTodos[index]?.content || ''}
                            onChange={(e) => handleTodoContent(e, index)}
                        />
                        <Button
                            text={<FontAwesomeIcon icon={faX} />}
                            type='cancel'
                            onClick={() => deleteApi(index)}
                        />
                    </li>
                ))
            }
        </div>
    )
}

export default TodoList;