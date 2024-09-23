import './BookDiary.scss';
import { useEffect, useState } from 'react';
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';

const BookDiary: React.FC = () => {
    const navigate = useNavigate();
    // api book list 타입 지정
    interface Book {
        id: string;
        title: string;
        author: string;
        description: string;
        image: string;
        isbn: string;
      }

    const [list, setList] = useState<Book[]>([]);
    const getApi = async () => {
        try{
            const url = 'http://localhost:3000/book';
            const response = await axios.get(url)
            if(response.status === 200) {
                setList(response.data)
            }
        }catch(error){
            console.error(error)
        }
    }

    useEffect(() => {
        getApi()
    }, [])

    // type bookInfo = {
    //     title: string,
    //     author: string,
    //     image: string,
    //     description: string,
    //     id: string,
    //     isbn: string
    // }
    const bookDetail = (item) => {
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
        console.log(item)
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
                        list.map((item) => (
                            <li key={item.isbn} 
                                className='border-bottom p-2 pb-3 g-0 row flex-nowrap cursor-pointer booklist'
                                onClick={() => bookDetail(item)}
                            >
                                <div className='imgArea m-0 p-0'>
                                    <img src={item.image} alt={item.title} />                                
                                </div>
                                <div className='row p-0 m-0'>
                                    <h5 className='mb-1 row align-items-center p-0 m-0'>{item.title}</h5>
                                    <p className='mb-1 row align-items-center p-0 m-0'>{item.author}</p>
                                </div>
                            </li>        
                        ))
                    }
                </ul>
            </section>
        </div>
    )
}

export default BookDiary;