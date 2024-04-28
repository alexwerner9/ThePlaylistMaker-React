import Button from '../../Common/Button/Button.jsx'
import Header from '../../Common/Header/Header.jsx'
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './MyPlaylists.css'
import ListItem from '../../Common/ListItem/ListItem.jsx'

function MyPlaylists(props) {
    const navigate = useNavigate()
    const [playlists, setPlaylists] = useState([])

    function playlistClickEvent(evt) {
        const url = '/playlist/'+evt.target.id
        navigate(url);
    }

    useEffect(() => {
        async function getPlaylists() {
            const resp = await fetch(import.meta.env.VITE_API_URL+'/getplaylists/'+localStorage.getItem('loginToken')+'?'+new URLSearchParams({
                isSpotifyUser: localStorage.getItem('isSpotifyUser')
            }), {
                redirect: 'follow'
            })
            const respJson = await resp.json()
            setPlaylists(respJson)
        }
        getPlaylists()
    }, [])

    function createplaylistClickEvent() {
        navigate('/createplaylist')
    }
 
    return (
        <div className="columns">
            <Header text="My Playlists" />
            <div id="playlists-wrapper">
                {playlists ? playlists.map((val) => <ListItem clickEvent={playlistClickEvent} 
                                                               text={val.playlistName} 
                                                               id={val.playlistId} 
                                                               key={val.playlistId} />)
                                                               : "No playlists yet"}
            </div>
            <Button text="Create new playlist" clickEvent={createplaylistClickEvent} />
        </div>
    );
}

export default MyPlaylists
