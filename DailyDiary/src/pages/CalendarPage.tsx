import './CalendarPage.scss'
import { useState } from "react";
import { Calendar } from 'react-calendar';
import CalendarDetail from '../components/CalendarDetail';
import moment from 'moment'; // yyyy-mm-dd format
import 'react-calendar/dist/Calendar.css'; // library custom css

const CalendarPage: React.FC = () => {
    // react-calendar 라이브러리 기본 설정
    type ValuePiece = Date | null;
    type Value = ValuePiece | [ValuePiece, ValuePiece];

    const [todayValue, onChange] = useState<Value>(new Date());
    
    // 클릭한 날짜를 저장하는 상태
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    
    // 날짜 클릭 시 자식에게 날짜 전달
    const deleverDate = (date: Date) => {
        setSelectedDate(date);
    }

    return (
        <div className="Calendar">
            <div className='row align-items-center justify-content-between mb-3 g-0 w-100'>
                <h3 className='w-auto'>달력 및 일정 관리</h3>
            </div>
            <section className="row componentSection">
                <div className="col-12 col-md-6">
                    <Calendar 
                        onChange={onChange} 
                        value={todayValue} 
                        formatDay={(_, date) => moment(date).format("D")}
                        onClickDay={(value) => {
                            deleverDate(value); // 클릭한 날짜를 전달
                        }}
                    />
                </div>
                <div className="col-12 col-md-6 mt-4 mt-md-0">
                    <CalendarDetail 
                        selectedDate={selectedDate} 
                    />
                </div>
            </section>
        </div>
    )
}

export default CalendarPage;
