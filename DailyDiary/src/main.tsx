import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'

import App from './App.tsx'
import BookDiary from './pages/BookDiary'
import WriteBookDiary from './pages/WriteBookDiary.tsx'
import NoData from './pages/NoData.tsx'
import NotFound from './pages/NotFound.tsx'
import Loading from './pages/Loading.tsx'
import BookDetail from './pages/BookDetail.tsx'

import { Provider } from 'react-redux';
import { store } from './app/store.ts';
import CalendarPage from './pages/CalendarPage.tsx'
import Diary from './pages/Diary.tsx'
import WriteDiary from './pages/WriteDiary.tsx'
import DiaryDetail from './pages/DiaryDetail.tsx'
import ChartPage from './pages/ChartPage.tsx'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path='/app' element={<App />}>
          <Route index element={<Diary />} />
          <Route path='bookdiary' element={<BookDiary />} />
          <Route path='writebookdiary' element={<WriteBookDiary />} />
          <Route path='bookdetail' element={<BookDetail />} />
          <Route path='calendar' element={<CalendarPage />} />
          <Route path='diary' element={<Diary />} />
          <Route path='writediary' element={<WriteDiary />} />
          <Route path='diarydetail' element={<DiaryDetail />} />
          <Route path='chart' element={<ChartPage />} />
        </Route>
        <Route path='/nodata' element={<NoData />} />
        <Route path='/loading' element={<Loading />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </Provider>
)
