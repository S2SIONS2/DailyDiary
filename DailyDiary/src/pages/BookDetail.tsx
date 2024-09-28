import Button from '../components/Button';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react'
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../src/app/store';
import { updateList } from '../features/api/BookListSlice';
import { deleteBook } from '../features/api/BookListSlice';

const BookDetail: React.FC = () => {
    const navigate = useNavigate();
    // 책 정보 받아오기
    const location = useLocation();
    const userInfo = { ...location.state };

    const [ bookTitle, setBookTitle ] =useState(userInfo.title || '') // 책 제목
    const [ author, setAuthor ] =useState(userInfo.author || '') // 책 저자
    const [ description, setDescription ] =useState(userInfo.description || '') // 책 줄거리
    const id = userInfo.id // 책 리스트 id 값

    // 책 제목 입력
    const handleBookTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBookTitle(e.target.value)
    };
    // 책 저자 입력
    const handleAuthor = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAuthor(e.target.value);
    };

    // 독후감 내용 입력
    const handleDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
    };

    // api list 수정
    const dispatch = useDispatch<AppDispatch>();
    const updateBtn = async () => {
        dispatch(updateList({ bookTitle, author, description, id }));
        navigate('/app/bookdiary')  
    }
    // 닫기 버튼 클릭 시
    const cancleBtn = async () => {
        navigate('/app/bookdiary')
    }
    // 삭제 버튼
    const removeBtn = async () => {
        dispatch(deleteBook({id}))
        navigate('/app/bookdiary')
    }

    return(
        <div className="BookDetail">
            <div className='row align-items-center justify-content-between mb-3 g-0 w-100'>
                <h3 className='w-auto'>독후감 수정</h3>
                <Button
                    text={'삭제'}
                    onClick={() => removeBtn()}
                    type={'confirm'}
                />
            </div>
            <section className='row m-0 mb-3 pb-3 border-bottom'>
                <h4 className='p-0'>책 제목</h4>
                <input type='text' className='w-auto me-2 flex-grow-1' value={bookTitle} onChange={handleBookTitle} placeholder={userInfo.title}/>
            </section>
            <section className='row m-0 mb-3 pb-3 border-bottom'>
                <h4 className='p-0'>저자</h4>
                <input type='text' className='w-auto flex-grow-1' value={author} onChange={handleAuthor} placeholder={userInfo.author}/>
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
                    text={'수정'}
                    onClick={() => updateBtn()}
                    type={"confirm"}
                />
            </section>
        </div>
    )
}

export default BookDetail;