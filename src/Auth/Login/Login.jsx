
import Button from '../../Common/Button/Button.jsx'
import './Login.css'
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import Header from '../../Common/Header/Header.jsx'
import Divider from '../../Common/Divider/Divider.jsx'

function Login() {
    const navigate = useNavigate();
    const [authError, setAuthError] = useState("");
    
    async function loginClickEvent() {
        const username = document.getElementById('username').value
        const password = document.getElementById('password').value

        if(!username || !password) {
            setAuthError("You must enter username and password.")
            return
        }

        const resp = await fetch(import.meta.env.VITE_API_URL+'/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            }),
            credentials: 'include'
        })
        const respJson = await resp.json()
        const loginToken = respJson['loginToken']
        if(loginToken) {
            localStorage.setItem('loginToken', loginToken)
            const loginRedirectHref = localStorage.getItem('loginRedirectHref')
            localStorage.removeItem('loginRedirectHref')
            if(loginRedirectHref) {
                window.location.href = loginRedirectHref
            } else {
                window.location.href = "/"
            }
        } else {
            setAuthError("Authentication failed.")
        }
    }

    function navigateToCreateaccount() {
        navigate('/createaccount')
    }

    function enterPressed(evt) {
        if(evt.key == 'Enter') {
            loginClickEvent()
        }
    }

    function spotifyLogin(evt) {
        const scope = 'user-read-private playlist-modify-public playlist-modify-private playlist-read-private playlist-read-collaborative';
        const state = '1234567812345678';
        window.location.href = 'https://accounts.spotify.com/authorize?' + new URLSearchParams({
            response_type: 'code',
            client_id: import.meta.env.VITE_SPOTIFY_API_CLIENT_ID,
            scope: scope,
            redirect_uri: import.meta.env.VITE_BASE_URL + "/spotifycallback",
            state: state
        })
    }

    return(
        <div className="columns">
            <Header text="Log in" />
            {authError && <div className="error">{authError}</div>}
            <input id="username" placeholder="Username" onKeyUp={enterPressed}></input>
            <input id="password" type="password"  placeholder="Password" onKeyUp={enterPressed}></input>
            <Button clickEvent={loginClickEvent} text="Log in"></Button>
            <a onClick={navigateToCreateaccount}>Or, create an account</a>
            <Divider direction="row"></Divider>
            <Button text="Sign in with Spotify" clickEvent={spotifyLogin}></Button>
        </div>
    )
}

export default Login
