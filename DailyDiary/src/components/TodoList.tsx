import './TodoList.scss'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../app/store'
import { deleteTodoList, fetchCalendatList } from '../features/api/CalendarSlice'

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
    // 날짜 선택, 오늘과 선택된 날짜
    const today = moment(new Date()).format('YYYY-MM-DD');
    const chooseDate = moment(selectedDate).format('YYYY-MM-DD');

    // api status
    const status = useSelector((state: RootState) => state.calendarLists.status);
    const dispatch = useDispatch<AppDispatch>();

    // api to do list 체크
    const apiTodoList = useSelector((state: RootState) => state.calendarLists.todoList)

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

    // to do list 추가
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

    // 새로 추가 한 to do list 삭제
    const deleteTodo = (i: number) => {
        setToDoList((prev) => prev.filter((_, index) => index !== i))
    }

    // 기존에 불러온 api to do list 체크, 컨텐츠 수정
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

    // api to do list 삭제
    const apiID = useSelector((state: RootState) => state.calendarLists.id)
    const deleteApi = (i: number) => {
        if( confirm('할 일 목록이 사라집니다. 진행 하시겠습니까?') == true){
            dispatch(deleteTodoList({ apiID, apiTodoList, i }))
        }
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
                            onClick={() => deleteTodo(index)}
                        />
                    </li>
                ))
            }
            {
                apiTodoList?.length > 0 && apiTodoList.map((_, index) => (
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