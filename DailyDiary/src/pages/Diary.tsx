import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'
import { RootState, AppDispatch } from '../app/store';
import { useEffect, useState } from 'react';
import { fetchDiarys } from '../features/api/Diary';

const Diary: React.FC = () => {
    // api 호출
    const diaryData = useSelector((state: RootState) => state.diaryLists.saveDiary)
    const status = useSelector((state: RootState) => state.diaryLists.status)

    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        if(status == 'idle'){
            dispatch(fetchDiarys());
        }
    }, [])

    // 일기 분류
    const [analysis, setAnalysis] = useState('date')
    const handleAnalysis = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setAnalysis(e.target.value);
    }
    const [sortedData, setSortedData] = useState<Diary[]>([]);
    const sortData = () => {
        if(analysis === 'date'){
            const newSortedData = [...diaryData]
            newSortedData.sort((a, b) => {
                const dateA = new Date(a.date)
                const dateB = new Date(b.date)
                return dateA.getTime() - dateB.getTime()
            })
            setSortedData(newSortedData)
        }else if(analysis === 'emotion'){
            const newSortedData = [...diaryData];
            newSortedData.sort((a, b) => {
                const emotionOrder = ['행복', '신남', '화남', '슬픔', '후회'];
                return emotionOrder.indexOf(a.emotion) - emotionOrder.indexOf(b.emotion)
            })
            setSortedData(newSortedData)
        }
    }
    useEffect(() => {
        if(diaryData.length > 0){
            sortData()
        }
    }, [diaryData, analysis])

    // 일기장 수정 페이지 이동
    const navigate = useNavigate();
    interface Diary {
        id: string,
        diaryTitle: string,
        date: string,
        emotion: string,
        description: string
    }
    const diaryDetail = (item: Diary) => {
        navigate('/app/diarydetail', {state: {item}})
    } 
    return (
        <div className="Diary">
            <div className='row align-items-center justify-content-between m-0 p-0'>
                <h3 className='mt-3 w-auto p-0'>감정 일기장</h3>
                <button type='button' className='w-auto'>
                    <Link to='/app/writediary' className='w-auto'>일기 작성</Link>
                </button>
            </div>
            <section>
            <div className='row align-items-center justify-content-end m-0 p-0'>
                <select className='w-auto pe-3' value={analysis} onChange={handleAnalysis}>
                    <option value="date">날짜</option>
                    <option value="emotion">감정</option>
                </select>
            </div>
            </section>
            <section>
                <ul className='m-0 g-0 p-0'>
                    {sortedData.length > 0 && sortedData.map((item, index) => (
                        <li key={index} 
                            className="mt-2 w-100 row align-items-center gap-2 p-0 g-0 cursor-pointer border-bottom"
                            onClick={() => diaryDetail(item)}
                        >
                            <p className='bg-light w-auto p-1 m-0'>{item.emotion} {item.diaryTitle}</p>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    )
}
export default Diary;