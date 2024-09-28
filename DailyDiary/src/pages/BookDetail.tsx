import Button from '../components/Button';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react'

const BookDetail = () => {
    const navigate = useNavigate();
    // 책 정보 받아오기
    const location = useLocation();
    const userInfo = { ...location.state };

    const [ bookTitle, setBookTitle ] =useState(userInfo.title || '') // 책 제목
    const [ author, setAuthor ] =useState(userInfo.author || '') // 책 저자
    const [ description, setDescription ] =useState(userInfo.description || '') // 책 줄거리
    // const [ bookImg, setBookImg] = useState('') // 책 이미지
    // const [ isbn, setIsbn ] = useState('') // 책 isbn(바코드) 값

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

    // db.json에 코드 수정 하기 
    const confirmBtn = async () => {
        try{
            //const url = 'http://localhost:3000/book?id=' + userInfo.isbn;
            const url = 'http://175.212.136.236:8081/book';
            console.log(url)
            const params = {
                // isbn: userInfo.isbn,
                title: bookTitle,
                author: author,
                description: description,
            }
            console.log(params)
            const response = await axios.put(url, params)
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

    // remove 버튼
    const removeBtn = async () => {
        try{
            const url = '/api/book?isbn=' + userInfo.isbn;
            const params = {
                // isbn: userInfo.isbn,
                title: bookTitle,
                author: author,
                description: description,
            }
            const response = await axios.delete(url, {
                params : params
            })
            if(response.status === 201) {
                navigate('/app/bookdiary')
            }
        }catch(error) {
            console.error(error)
        }
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
                    onClick={() => confirmBtn()}
                    type={"confirm"}
                />
            </section>
        </div>
    )
}

export default BookDetail;