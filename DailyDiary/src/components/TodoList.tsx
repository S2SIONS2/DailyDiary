import './TodoList.scss'
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { useEffect, useState } from "react";
import { fetchTodoLists } from "../features/api/ToDoSlice";
import moment from "moment";
import Button from './Button';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faPlus } from "@fortawesome/free-solid-svg-icons";

interface TodoListProps {
    selectedDate: Date | null,
    getTodos: {
        checked: boolean,
        content: string
    }
}

const TodoList: React.FC<TodoListProps> = ({ selectedDate, getTodos }) => {
    // calendar api 호출 - to do list
    const apiData = useSelector((state: RootState) => state.todoList.todoList)
    const status = useSelector((state: RootState) => state.todoList.status)
    const dispatch = useDispatch<AppDispatch>()
    
    // 오늘 날짜
    const today = moment(new Date()).format('YYYY-MM-DD') // 오늘 날짜
    // 달력 선택 된 날짜
    const chooseDate = moment(selectedDate).format('YYYY-MM-DD')// 달력 클릭 날짜
    // 동일 날짜 리스트 중 새로 고침 시 오늘 일정으로 고정
    const selectedTodoList = apiData.find(item => item.date === chooseDate); // api list 중 클릭한 날짜와 동일한 날짜의 리스트
    const todayTodoList = apiData.find(item => item.date === today); // api list 중 클릭한 날짜와 동일한 날짜의 리스트
    const apiTodoList = selectedTodoList?.todoList !== undefined ? selectedTodoList?.todoList : todayTodoList?.todoList

    useEffect(() => {
        if (status === 'idle') {
            if(!chooseDate || isNaN(new Date(chooseDate).getTime())){
                dispatch(fetchTodoLists({ today }))
            }else{
                dispatch(fetchTodoLists({ chooseDate }))
            }
        }
    }, [today, chooseDate])

    // to do list 추가
    const [todoList, setTodoList] = useState([{
        checked: false,
        content: ''
    }])

    // to do list 등록 할 input value
    const onChangeValue = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, type, checked, value } = e.target;
        const newTodoList = [...todoList];
        
        // 타입에 따라 체크박스와 텍스트 값을 구분하여 업데이트
        newTodoList[index] = {
            ...newTodoList[index],
            [name]: type === 'checkbox' ? checked : value
        };

        setTodoList(newTodoList);
    };

    // to do list 추가
    const addTodoList = () => {
        setTodoList([...todoList, { checked: false, content: '' }]);
    };
    
    // to do List 삭제
    const deleteTodoList = (index: number) => {
        const newList = todoList.filter((_, i) => i !== index)
        setTodoList(newList)
    }

    // api post 호출
    // 부모로 todo 정보 전달
    const setTodos = () => {
        getTodos(todoList);
    };

    return (
        <div className="TodoList">
            <div className='row align-items-center justify-content-between m-0 g-0 p-0'>
                <h5 className='w-auto'>할 일 목록</h5>
                <Button 
                    text={<FontAwesomeIcon icon={faPlus} />}
                    type='confirm'
                    onClick={addTodoList}   
                />
            </div>
            <div className="row align-items-center m-0 g-0">
                {/* {
                    !apiTodoList && '할 일 목록이 없습니다.'
                } */}
                {
                    todoList && todoList.map((item, index) => (
                        <div key={index} className="row align-items-center m-0 g-0 gap-1 mt-2">
                            <label className="row align-items-center gap-1 m-0 g-0 w-auto flex-grow-1">
                                <input type="checkbox" className="m-0 g-0" name='todoList' checked={item.checked}/>
                                <input 
                                    type="text" 
                                    className="w-auto flex-grow-1 m-0 g-0"
                                    placeholder="오늘의 할 일 목록은 무엇인가요?"
                                    name='content'
                                    value={item.content}
                                    onChange={(e) => onChangeValue(index, e)}
                                />                  
                            </label>
                            <Button 
                                text={<FontAwesomeIcon icon={faX} />}
                                type='cancel'
                                onClick={() => deleteTodoList(index)}  
                            />
                        </div>
                    ))
                }
                {
                    apiTodoList && apiTodoList.map((item, index) => (
                        <div key={index} className="row align-items-center m-0 g-0 gap-1 mt-2">
                            <label className="row align-items-center gap-1 m-0 g-0">
                                <input type="checkbox" className="m-0 g-0" checked={item.checked}/>
                                <input type="text" 
                                    className="w-auto flex-grow-1 m-0 g-0"
                                    placeholder="오늘의 할 일 목록은 무엇인가요?"
                                    value={item.content}
                                />                         
                            </label>
                        </div>               
                    ))
                }
            </div>
        </div>
    )
}

export default TodoList;