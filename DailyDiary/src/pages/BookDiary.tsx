import './BookDiary.scss';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../src/app/store';
import { fetchBooks } from '../features/api/BookSlice';

const BookDiary: React.FC = () => {
    const bookList = useSelector((state: RootState) => state.books.bookList)
    const status = useSelector((state: RootState) => state.books.status)
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if(status === 'idle') {
            dispatch(fetchBooks())
        }
        console.log(bookList)
    }, []) // dispatch, status

    return (
        <div className='BookDiary'>
            <h1>Book List</h1>
            {status === 'loading' && <p>Loading...</p>}
            {status === 'failed' && <p>Error loading books.</p>}
            <ul>
                {bookList.map((book) => (
                    <li key={book.isbn}>{book.title}</li>
                ))}
            </ul>
        </div>
    )
}

export default BookDiary;