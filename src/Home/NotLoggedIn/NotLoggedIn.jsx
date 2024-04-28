import Button from '../../Common/Button/Button.jsx'
import Header from '../../Common/Header/Header.jsx'
import { useNavigate } from "react-router-dom";

function NotLoggedIn() {
    const navigate = useNavigate();
    const createaccountOnClick = () => {
        navigate('/createaccount')
    }

    const loginOnClick = evt => {
        navigate('/login')
    }
    return (
        <div id="main-div">
        <Header text="Welcome!" />
        <Button text="Log in" clickEvent={loginOnClick} />
        <Button text="Create account" clickEvent={createaccountOnClick} />
    </div>
    )
}

export default NotLoggedIn
