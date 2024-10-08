import './TodoList.scss'
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { useEffect, useState } from "react";
import moment from "moment";
import Button from './Button';

import { fetchTodoLists, addTodoLists, updateTodo } from "../features/api/ToDoSlice";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faPlus } from "@fortawesome/free-solid-svg-icons";

interface TodoListProps {
    selectedDate: Date | null
}

const TodoList: React.FC<TodoListProps> = ({ selectedDate }) => {
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
    const apiId = selectedTodoList?.id // api list id
    const apiDate = selectedTodoList?.date // api list date

    useEffect(() => {
        if (status === 'idle') {
            if(!chooseDate || isNaN(new Date(chooseDate).getTime())){
                dispatch(fetchTodoLists({ today }))
            }else{
                dispatch(fetchTodoLists({ chooseDate }))
            }
        }
    }, [today, chooseDate])

    interface Todo {
        checked: boolean,
        content: string
    }
    // to do list 추가
    const [todoList, setTodoList] = useState<Todo[]>([]);

    // to do list 등록 할 input value
    // 체크박스 변경을 처리하는 함수
    const onChangeCheck = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const newTodoList = [...todoList];
        newTodoList[index] = {
            ...newTodoList[index],
            checked: e.target.checked,
        };
        setTodoList(newTodoList);
    };

    // 텍스트 입력 변경을 처리하는 함수
    const onChangeValue = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const newTodoList = [...todoList]; 
        newTodoList[index] = {
            ...newTodoList[index],
            content: e.target.value,
        };
        setTodoList(newTodoList);
    };

    

    // to do list 추가
    const addTodoList = () => {
        setTodoList([...todoList, { checked: false, content: '' }]);
    };
    // onChange checkbox
    // const onChangeApiCheck = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        
    // }
    
    // to do List 삭제
    const deleteTodoList = (index: number) => {
        const newList = todoList.filter((_, i) => i !== index)
        setTodoList(newList)
    }

    // api post 호출
    const postApi = () => {
        dispatch(addTodoLists({chooseDate, todoList}))
        // console.log('실행')
    }
    const updateTodos = () => {
        dispatch(updateTodo({apiId, apiDate, todoList}))
        // console.log('두번째꺼 실행')
    }
    // console.log(todoList)
    // 날짜 변경 시 마다 자동으로 투 두 리스트 저장
    useEffect(() => {
        // to do list, 일정이 없을 때 (새로 추가 시)
        // console.log(apiData)
        if(apiData.length === 0 && todoList.length >= 1) {
            postApi()
        }
        // 일정 만 있을 때
        else if(apiTodoList !== undefined && apiTodoList?.length > 1 && todoList.length >= 1) {
            updateTodos()
        }
    }, [chooseDate])

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
                                <input 
                                    type="checkbox" 
                                    className="m-0 g-0" 
                                    name='todoList' 
                                    checked={item.checked} 
                                    onChange={(e) => onChangeCheck(index, e)} // 체크박스 변경 처리
                                />
                                <input 
                                    type="text" 
                                    className="w-auto flex-grow-1 m-0 g-0"
                                    placeholder="오늘의 할 일 목록은 무엇인가요?"
                                    name='content'
                                    value={item.content}
                                    onChange={(e) => onChangeValue(index, e)} // 텍스트 입력 변경 처리
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