import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import BookDiary from './pages/BookDiary'
import './index.css'

import { Provider } from 'react-redux';
import { store } from './app/store.ts';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path='/app' element={<App />}>
          <Route index element={<BookDiary />} />
          <Route path='bookdiary' element={<BookDiary />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </Provider>
)
