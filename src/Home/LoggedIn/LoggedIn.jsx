import Button from '../../Common/Button/Button.jsx'
import './LoggedIn.css'
import Header from '../../Common/Header/Header.jsx'
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import NotLoggedIn from '../NotLoggedIn/NotLoggedIn.jsx';
import Divider from '../../Common/Divider/Divider.jsx';

function LoggedIn() {
    const navigate = useNavigate();
    localStorage.removeItem('loginRedirectHref')

    let username = localStorage.getItem('username')
    const [text, setText] = useState(username ? "Hello " + username + "!" : "Hello")

    useEffect(() => {
        getUsername()
    })

    async function getUsername() {
        let username = localStorage.getItem('username')
        if(!username) {
            const resp = await fetch(import.meta.env.VITE_API_URL+'/getusername/'+localStorage.getItem('loginToken'), {credentials: 'include'})
            const respJson = await resp.json()
            const username = respJson['username']
            localStorage.setItem('username', username)
            setText("Hello " + username + "!")
        }
    }

    function createplaylistClickEvent() {
        navigate('/createplaylist')
    }

    function myplaylistsClickEvent() {
        navigate('/myplaylists')
    }

    return (
        <div className="columns">
            <Header text={text} />
            <Button clickEvent={createplaylistClickEvent} text="Create a new playlist" />
            <Button clickEvent={myplaylistsClickEvent} text="My playlists" />
            <Divider direction="row" />
            <Button text="Recent playlists" clickEvent={() => {navigate('/recentlycontributed')}} />
        </div>
    )
}

export default LoggedIn
