import './WriteBookDiary.scss'
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../src/app/store';
import { fetchBooks } from '../features/api/BookSlice';
import { addList } from '../features/api/BookListSlice';
import axios from 'axios'
import Button from '../components/Button';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';

const WriteBookDiary: React.FC = () => {
    const bookList = useSelector((state: RootState) => state.books.bookList) // api search list
    const status = useSelector((state: RootState) => state.books.status) // api search list status

    const dispatch = useDispatch<AppDispatch>();
    
    const navigate = useNavigate();
    const [ bookTitle, setBookTitle ] =useState('') // 책 제목
    const [ author, setAuthor ] =useState('') // 책 저자
    const [ description, setDescription ] =useState('') // 책 줄거리
    const [ bookImg, setBookImg] = useState('') // 책 이미지
    const [ isbn, setIsbn ] = useState('') // 책 isbn(바코드) 값

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
    const total = useSelector((state: RootState) => state.books.totalBookList) // 전체 리스트 길이
    const handlePreBtn = (pageNumber: number) => {
        if( presentPage == 1 || currentPage == 1 ) {
            setCurrentPage(1)
            setPresentPage(1)
        }else {
            setCurrentPage(currentPage - pageNumber)
            setPresentPage(presentPage - 1)
        }
    } 
    const handleNextBtn = (pageNumber: number) => {
        if ( currentPage + 3 >= total){
            alert('마지막 리스트 입니다.')
        }else {
            setCurrentPage(currentPage + pageNumber)
            setPresentPage(presentPage + 1)
        }
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

    // 독후감 내용 입력
    const handleDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
    };

    // 선택한 api 정보 값 추출
    type bookInfo = {
        title: string,
        author: string,
        image: string,
        isbn: string
    }
    const saveItemInfo = (book: bookInfo) => {
        setBookTitle(book.title)
        setAuthor(book.author)
        setBookImg (book.image)
        setIsbn(book.isbn)
    } 

    // Book API에 정보 저장
    const confirmBtn2 = async () => {
        dispatch(addList({ bookTitle, author, bookImg, description, isbn }));
        navigate('/app/bookdiary')  
    }
    const confirmBtn = async () => {
        try{
            const url = 'http://175.212.136.236:8081/book';
            const params = {
                title: bookTitle,
                author: author,
                image: bookImg,
                description: description,
                isbn: isbn
            }
            const response = await axios.post(url, params)
            if(response.status === 201) {
                navigate('/app/bookdiary')
            }
        }catch(error) {
            console.error(error)
        }
    }
    // 닫기 버튼 클릭 시
    const cancleBtn = async () => {
        navigate('/app/bookdiary')
    }

    return (
        <div className="WriteBookDiary p-2">
            <section className='row m-0 mb-3 pb-3 border-bottom'>
                <h4 className='p-0'>책 제목</h4>
                <p className='text-muted p-0'>책 검색 후 기록할 책을 클릭 하시면 더욱 간편하게 작성이 가능합니다.</p>
                <input type='text' className='w-auto me-2 flex-grow-1' value={bookTitle} onChange={handleBookTitle}/>
                <button className='w-auto' onClick={handleSearch}>Search</button>
            </section>
            <ul className='row list-ul p-0 m-0 mb-3'>
                {
                    bookList.map((book) => (
                        <li key={book.isbn} 
                            className='border border-1 p-2 g-0 row flex-nowrap cursor-pointer booklist'
                            onClick={() => saveItemInfo(book)}
                        >                            
                            <div className='imgArea m-0 p-0'>
                                <img src={book.image} alt={book.title} />                                
                            </div>
                            <div className='row p-0 m-0'>
                                <h5 className='mb-1 row align-items-center p-0 m-0'>{book.title}</h5>
                                <p className='mb-1 row align-items-center p-0 m-0'>{book.author}</p>
                            </div>
                        </li>
                    ))
                }
                {
                    bookList.length != 0 && (
                        <div className='row align-items-center justify-content-center mt-3 mb-3 gap-2'>
                            <Button 
                                text={<FontAwesomeIcon icon={faChevronLeft} />}
                                type={"button"}
                                onClick={() => handlePreBtn(3)}
                            />
                            <p className='w-auto m-0 p-0'>{presentPage}</p>
                            -
                            <p className='w-auto m-0 p-0 text-muted'>{total == 1 ? 1 : Math.floor(total / 3)}</p>
                            <Button 
                                text={<FontAwesomeIcon icon={faChevronRight} />}
                                type={"button"}
                                onClick={() => handleNextBtn(3)}
                            />
                        </div>
                    )
                }
            </ul>
            <section className='row m-0 mb-3 pb-3 border-bottom'>
                <h4 className='p-0'>저자</h4>
                <input type='text' className='w-auto flex-grow-1' value={author} onChange={handleAuthor}/>
            </section>
            <section className='row m-0 mb-3'>
                <h4 className='p-0'>독후감</h4>
                <textarea className='w-auto flex-grow-1' value={description} onChange={handleDescription}/>
            </section>
            <section className='row align-items-center justify-content-center gap-2 m-0 mb-3'>
                <Button
                    text={'닫기'}
                    onClick={() => cancleBtn()}
                    type={'cancle'}
                />
                <Button
                    text={'저장'}
                    onClick={() => confirmBtn()}
                    type={"confirm"}
                />
                <Button
                    text={'임시 저장'}
                    onClick={() => confirmBtn2()}
                    type={"confirm"}
                />
            </section>
        </div>
    )
}

export default WriteBookDiary;