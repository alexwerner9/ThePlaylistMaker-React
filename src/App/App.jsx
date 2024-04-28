import './App.css'
import Button from '../Common/Button/Button.jsx'
import Header from '../Common/Header/Header.jsx'
import { useNavigate } from "react-router-dom";
import { useEffect } from "react"
import { isLoggedIn } from '../auth.js'
import LoggedIn from '../Home/LoggedIn/LoggedIn.jsx'
import NotLoggedIn from '../Home/NotLoggedIn/NotLoggedIn.jsx';

function App() {
  if(isLoggedIn()) {
    return <LoggedIn />
  } else {
    return (
      <NotLoggedIn />
    )
  }
}

export default App
