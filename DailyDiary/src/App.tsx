import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import './reset.css'
import { Link, Outlet } from 'react-router-dom'
import { useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

function App() {
  const [nav, setNav] = useState(false)

  return (
    <div className="App">
      <button type="button" onClick={() => setNav(true)}>
        <FontAwesomeIcon icon={faBars} />
      </button>
      {
        nav && (
          <nav>
            <Link to='/app/bookdiary' onClick={() => setNav(false)}>독서록</Link>
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
