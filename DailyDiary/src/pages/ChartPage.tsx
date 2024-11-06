import { useDispatch, useSelector } from 'react-redux';
import { ResponsiveContainer, Bar, BarChart, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import { AppDispatch, RootState } from '../app/store';
import { useEffect, useState } from 'react';
import { fetchCalendar } from '../features/api/CalendarSlice';
import Loading from './Loading';
import { Root } from 'react-dom/client';

const ChartPage: React.FC = () => {
    const [loading, setLoading] = useState(true)

    const apiCalendarList = useSelector((state: RootState) => state.calendarLists)
    // const apiDate = useSelector((state: RootState) => state.calendarLists.date)
    // const apiTodoList = useSelector((state: RootState) => state.calendarLists.todoList)
    const apiTodoList = useSelector((state: RootState) => state.calendarLists.todoList)
    const status = useSelector((state: RootState) => state.calendarLists.status)

    const dispatch = useDispatch<AppDispatch>();

    const newTodoChecked = apiCalendarList.todoList.map((item) => item.checked)
    const newTodoContent = apiCalendarList.todoList.map((item) => item.content)

    useEffect(() => {
        if(status == 'idle'){
            dispatch(fetchCalendar())

            
            console.log(apiCalendarList)
            console.log(newTodoChecked)
            setLoading(false)
        }
    }, [])

    if(loading === true){
        return <Loading />
    }
    
    return (
        <div className="ChartPage">
            <div className='row align-items-center justify-content-between mb-3 g-0 w-100'>
                <h3 className='w-auto'>나의 성장 일기</h3>
            </div>
            <section className="row">
                <h5>목표 성공률</h5>
                <p className='fs-5 text'>하루</p>
                <div>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart
                            data={apiTodoList}
                            margin={{
                                top: 5, right:30, left: 20, bottom: 5
                            }}
                        >
                            <XAxis 
                                dataKey="content"
                            />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="checked">

                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <p className='fs-5 text'>한달</p>
                <div>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart
                            data={apiTodoList}
                            margin={{
                                top: 5, right:30, left: 20, bottom: 5
                            }}
                        >
                            <XAxis 
                                dataKey="todoList"
                            />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </section>
            <section>
                <h5>습관트래커</h5>
            </section>
            <section>
                <h5>한달의 감정</h5>
            </section>
        </div>
    )
}


export default ChartPage;