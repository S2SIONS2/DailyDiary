import { useDispatch, useSelector } from 'react-redux';
import './BookDiary.scss';
import { Link, useNavigate } from 'react-router-dom'
import { fetchLists } from '../features/api/BookListSlice';
import { RootState, AppDispatch } from '../../src/app/store';
import { useEffect } from 'react';
import Loading from './Loading';
import NoData from './NoData';


const BookDiary: React.FC = () => {
    const {saveBookList, status} = useSelector((state: RootState) => state.lists)
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (status === 'idle') {
          dispatch(fetchLists());
        }
      }, []);

    const navigate = useNavigate();

    type bookInfo = {
        title: string,
        author: string,
        image: string,
        description: string,
        id: string,
        isbn: string
    }
    const bookDetail = (item: bookInfo) => {
        navigate('/app/bookdetail', {
            state: {
              title: item.title,
              author: item.author,
              image: item.image,
              description: item.description,
              id: item.id,
              isbn: item.isbn
            },
          });
    }

    // api list 로딩중일때
    if (status === 'loading') {
        return (
            <Loading />
        )
    }
    // api list 값이 없을 때
    if (status === 'failed') {
        return (
            <NoData />
        )
    }
    
    return (
        <div className='BookDiary'>
            <div className='row align-items-center justify-content-between m-0 p-0'>
                <h3 className='mt-3 w-auto p-0'>독서록</h3>
                <button type='button' className='w-auto'>
                    <Link to='/app/writebookdiary' className='w-auto'>독서록 작성</Link>
                </button>
            </div>
            <section>
                <ul className='m-0 p-0 g-0 border'>
                    {
                        saveBookList.map((item) => (
                            <li key={item.isbn} 
                                className='border-bottom p-2 pb-3 g-0 row flex-nowrap position-relative booklist'
                            >
                                <div className='imgArea m-0 p-0'>
                                    <img src={item.image} alt={item.title} />                                
                                </div>
                                <div className='row p-0 m-0'>
                                    <h5 className='mb-1 row align-items-center p-0 m-0'>{item.title}</h5>
                                    <p className='mb-1 row align-items-center p-0 m-0'>{item.author}</p>
                                </div>
                                <button
                                    className='position-absolute end-0'
                                    type='button'
                                    onClick={() => bookDetail(item)}> 수정</button>
                            </li>        
                        ))
                    }
                </ul>
            </section>
        </div>
    )
}

export default BookDiary;