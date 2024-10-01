import { useState } from "react";
import { Calendar } from 'react-calendar';
import CalendarDetail from '../components/CalendarDetail';
import moment from 'moment'; // yyyy-mm-dd format
import 'react-calendar/dist/Calendar.css'; // library custom css

const CalendarPage: React.FC = () => {
    // react-calendar 라이브러리 기본 설정
    type ValuePiece = Date | null;
    type Value = ValuePiece | [ValuePiece, ValuePiece];

    const [value, onChange] = useState<Value>(new Date());
    
    // 클릭한 날짜를 저장하는 상태
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    
    // 모달을 열고 닫는 상태
    const [modal, setModal] = useState(false);
    
    // 날짜 클릭 시 모달 열기 및 날짜 저장
    const openModal = (date: Date) => {
        setSelectedDate(date);
        setModal(true);
    }

    return (
        <div className="Calendar">
            <div className='row align-items-center justify-content-between mb-3 g-0 w-100'>
                <h3 className='w-auto'>달력 및 일정 관리</h3>
            </div>
            <section>
                <Calendar 
                    onChange={onChange} 
                    value={value} 
                    formatDay={(local, date) => moment(date).format("D")}
                    onClickDay={(value) => {
                        openModal(value); // 클릭한 날짜를 전달
                    }}
                />
            </section>
            {/* {moment(value).format("YYYY년 MM월 DD일")}  */}
            {
                modal && <CalendarDetail selectedDate={selectedDate} onClose={() => setModal(false)} />
            }
        </div>
    )
}

export default CalendarPage;
