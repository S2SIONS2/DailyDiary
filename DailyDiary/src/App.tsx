import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import Button from './components/Button'
import { Outlet, Link } from 'react-router-dom'
import { useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

function App() {
  const [nav, setNav] = useState(false)

  return (
    <div className="App position-relative">
      <div className="row justify-content-between w-auto m-0 p-0">
        <h1 className="w-auto mainTitle">
          <a className="mainTitle" href="/app">My Diary</a>
        </h1>
        <Button 
          text={<FontAwesomeIcon icon={faBars} />}
          onClick={() => setNav(!nav)} 
          type={"confirm"}
        />
      </div>
      {
        nav && (
          <nav className="row w-100 h-100 mt-2 border border-2 border-warning">
            <div className="h-auto mt-2">
              <Link className="row align-items-center justify-content-end m-0 border-bottom border-warning mb-2" to='/app/bookdiary' onClick={() => setNav(false)}>독서록</Link>
              <Link className="row align-items-center justify-content-end m-0 border-bottom border-warning mb-2" to='/app/calendar' onClick={() => setNav(false)}>달력</Link>
            </div>
          </nav>
        )
      }
      <div className="content">
        <Outlet />
      </div>
    </div>
  )
}

export default App
