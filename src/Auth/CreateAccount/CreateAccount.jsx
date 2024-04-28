import Button from '../../Common/Button/Button.jsx'
import './CreateAccount.css'
import { useNavigate } from "react-router-dom";
import Header from '../../Common/Header/Header.jsx'

function CreateAccount() {
    const navigate = useNavigate()
    async function createaccountClickEvent() {
        const username = document.getElementById('username').value
        const password = document.getElementById('password').value
        const resp = await fetch(import.meta.env.VITE_API_URL+'/createaccount', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        const respJson = await resp.json()
        const loginToken = respJson['loginToken']
        if(!loginToken) {
            console.log(respJson.error)
        } else {
            localStorage.setItem("loginToken", loginToken)
            navigate('/')
        }
    }

    function enterPressed(evt) {
        if(evt.key == 'Enter') {
            createaccountClickEvent()
        }
    }

    return(
        <div className="columns">
            <Header text="Create an account" />
            <input id="username" placeholder="Username" onKeyUp={enterPressed}></input>
            <input id="password" type="password"  placeholder="Password" onKeyUp={enterPressed}></input>
            <Button clickEvent={createaccountClickEvent} text="Create account"></Button>
        </div>
    )
}

export default CreateAccount
