import './BookDiary.scss';
import { Link } from 'react-router-dom'

const BookDiary: React.FC = () => {
    
    return (
        <div className='BookDiary'>
            <h1 className='mt-3'>독서록 작성</h1>
            
            <Link to='/app/writebookdiary'>독서록 작성</Link>
            
        </div>
    )
}

export default BookDiary;