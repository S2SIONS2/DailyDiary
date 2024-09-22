import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'

import App from './App.tsx'
import BookDiary from './pages/BookDiary'
import WriteBookDiary from './pages/WriteBookDiary.tsx'
import NoData from './pages/NoData.tsx'
import NotFound from './pages/NotFound.tsx'
import Loading from './pages/Loading.tsx'

import { Provider } from 'react-redux';
import { store } from './app/store.ts';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path='/app' element={<App />}>
          <Route index element={<BookDiary />} />
          <Route path='bookdiary' element={<BookDiary />} />
          <Route path='writebookdiary' element={<WriteBookDiary />} />
        </Route>
        <Route path='/nodata' element={<NoData />} />
        <Route path='/loading' element={<Loading />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </Provider>
)
