import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
// import Button from './components/Button'
import { Outlet } from 'react-router-dom'
// import { useState } from 'react'
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faBars } from "@fortawesome/free-solid-svg-icons";

function App() {
  // const [nav, setNav] = useState(false)

  return (
    <div className="App">
      {/* <div className="row justify-content-end w-auto">
        <Button 
          text={<FontAwesomeIcon icon={faBars} />}
          onClick={() => setNav(true)} 
          type={"confirm"}
        />
      </div> */}
      {/* {
        nav && (
          <nav>
            <Link to='/app/bookdiary' onClick={() => setNav(false)}>독서록</Link>
          </nav>
        )
      } */}
      <div className="content">
        <Outlet />
      </div>
    </div>
  )
}

export default App
