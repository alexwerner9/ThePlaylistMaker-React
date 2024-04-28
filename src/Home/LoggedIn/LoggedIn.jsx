import Button from '../../Common/Button/Button.jsx'
import './LoggedIn.css'
import Header from '../../Common/Header/Header.jsx'
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import NotLoggedIn from '../NotLoggedIn/NotLoggedIn.jsx';

function LoggedIn() {
    const navigate = useNavigate();

    let username = localStorage.getItem('username')
    const [text, setText] = useState(username ? "Hello " + username + "!" : "Hello")

    useEffect(() => {
        getUsername()
    })

    async function getUsername() {
        let username = localStorage.getItem('username')
        if(!username) {
            console.log("NOT FOUND")
            const resp = await fetch(import.meta.env.VITE_API_URL+'/getusername/'+localStorage.getItem('loginToken'))
            const respJson = await resp.json()
            const username = respJson['username']
            localStorage.setItem('username', username)
            setText("Hello " + username + "!")
        }
    }
    function logoutClickEvent() {
        localStorage.clear()
        window.location.reload()
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
            <Button clickEvent={logoutClickEvent} text="Log out" />
        </div>
    )
}

export default LoggedIn
