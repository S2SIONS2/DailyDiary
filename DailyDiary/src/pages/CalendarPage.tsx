import { useState } from "react";
import { Calendar } from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import CalendarDetail from '../components/CalendarDetail'
import moment from 'moment'

const CalendarPage: React.FC = () => {
    // react-calendar 라이브러리 기본 설정
    type ValuePiece = Date | null;
    type Value = ValuePiece | [ValuePiece, ValuePiece];

    const [value, onChange] = useState<Value>(new Date());

    // 날짜 클릭 시 모달 생성
    const [modal, setModal] = useState(false);
    const openModal = () => {
        setModal(true)
    }
    
    return (
        <div className="Calendar">
            <div className='row align-items-center justify-content-between mb-3 g-0 w-100'>
                <h3 className='w-auto'>달력</h3>
            </div>
            <section>
                <Calendar 
                    onChange={onChange} 
                    value={value} 
                    onClickDay={console.log(value)}
                    onClick={() => openModal()}
                />
            </section>
            {moment(value).format("YYYY년 MM월 DD일")} 
            {
                modal && <CalendarDetail />
            }
        </div>
    )
}

export default CalendarPage;