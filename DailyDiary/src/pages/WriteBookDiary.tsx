import Loading from './Loading';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../src/app/store';
import { fetchBooks } from '../features/api/BookSlice';

const WriteBookDiary: React.FC = () => {
    const bookList = useSelector((state: RootState) => state.books.bookList) // api list
    const status = useSelector((state: RootState) => state.books.status) // api list status
    const dispatch = useDispatch<AppDispatch>();
    
    const [ bookTitle, setBookTitle ] =useState('') // 책 제목
    const [ author, setAuthor ] =useState('') // 책 저자
    const [ description, setDescription ] =useState('') // 책 줄거리

    // 책 제목 입력
    const handleBookTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputBookTitle = (e.target.value)
        setBookTitle(inputBookTitle);
        dispatch(fetchBooks({bookTitle: inputBookTitle, currentPage})); 
    };
    // 책 제목, start값을 fetchBooks에 전달
    const handleSearch = () => {
        dispatch(fetchBooks({bookTitle, currentPage}));
    };

    // 책 갯수 3개씩 페이징
    const [ currentPage, setCurrentPage ] = useState(1); // api start 위치
    const [ presentPage, setPresentPage] = useState(1) // 현재 리스트 페이지
    const handlePreBtn = (pageNumber: number) => {
        setCurrentPage(currentPage - pageNumber)
        setPresentPage(presentPage - 1)
    } 
    const handleNextBtn = (pageNumber: number) => {
        setCurrentPage(currentPage + pageNumber)
        setPresentPage(presentPage + 1)
    }    

    useEffect(() => {
        if(status === 'idle') {
            dispatch(fetchBooks({ bookTitle, currentPage }))
        }
    }, [bookTitle, currentPage]) // dispatch, status
    

    // 책 저자 입력
    const handleAuthor = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAuthor(e.target.value);
    };

    // 책 줄거리 입력
    const handleDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
    };

    // db.json에 코드 담기 
    // await axios.post('http://localhost:3000/book', {
    //     title: response.data.item[0].title,
    //     image: response.data.item[0].image,
    //     author: response.data.item[0].author,
    //     isbn: response.data.item[0].isbn,
    //     description: response.data.item[0].description
    // });


    return (
        <div className="WriteBookDiary">
            <section className='row mb-3'>
                <h4>책 제목</h4>
                <input type='text' className='w-auto me-2 flex-grow-1' value={bookTitle} onChange={handleBookTitle}/>
                <button className='w-auto' onClick={handleSearch}>Search</button>
            </section>
            <ul className='row'>
                {
                    status === 'loading' && <Loading />
                }
                {
                    bookList.map((book) => (
                        <li key={book.isbn} className='border border-1 p-2 row flex-nowrap cursor-pointer'>
                            <img src={book.image} alt={book.title} style={{ width: '100px', height: 'auto' }} />
                            <div className='row flex-grow-1'>
                                <h5 className='mb-1 row align-items-center'>{book.title}</h5>
                                <p className='mb-1 row align-items-center'>{book.author}</p>
                            </div>
                        </li>
                    ))
                }
                {
                    bookList && (
                        <div className='row align-items-center justify-content-center'>
                            <button
                                onClick={() => handlePreBtn(3)}
                                className='w-auto m-0 g-0'
                            >
                                -
                            </button>
                            <p className='w-auto m-0 g-0'>{presentPage}</p>
                            <button
                                onClick={() => handleNextBtn(3)}
                                className='w-auto m-0 g-0'
                            >
                                +
                            </button>
                        </div>
                    )
                }
            </ul>
            <section className='row mb-3'>
                <h4>저자</h4>
                <input type='text' className='w-auto me-2 flex-grow-1' value={author} onChange={handleAuthor}/>
            </section>
            <section className='row mb-3'>
                <h4>독후감</h4>
                <textarea className='w-auto me-2 flex-grow-1' value={description} onChange={handleDescription}/>
            </section>
        </div>
    )
}

export default WriteBookDiary;