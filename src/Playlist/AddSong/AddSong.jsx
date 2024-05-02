
import React, { Component, useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../Common/Header/Header.jsx'
import Button from '../../Common/Button/Button.jsx'
import CheckBox from '../../Common/CheckBox/CheckBox.jsx';
import ListItem from '../../Common/ListItem/ListItem.jsx';
import './AddSong.css'

function AddSong() {
    const navigate = useNavigate()
    
    const { playlistId } = useParams()
    const [songs, setSongs] = useState([])

    let timeoutId;
    let blocked = false;
    function searchUpdate(evt) {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(async () => {
            blocked = false;
            if(!evt.target.value) {
                setSongs([])
                return;
            }
            const resp = await fetch(import.meta.env.VITE_API_URL+'/search?name='+evt.target.value, {credentials: 'include'});
            const respJson = await resp.json()
            if(respJson.length) {
                setSongs(respJson);
            }
        }, 200)
    }

    const inputField = useRef(null)

    async function songClickEvent(evt) {
        const song = songs[evt.target.id]
        const resp = await fetch(import.meta.env.VITE_API_URL+'/addsong', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: song.name,
                artist: song.artist,
                uri: song.uri,
                spotifyUrl: song.spotifyUrl,
                playlistId: playlistId,
                addedBy: inputField.current.value
            }),
            credentials: 'include'
        })
        const respJson = await resp.json()
        localStorage.setItem('addedSongUser', inputField.current.value)
        navigate('/playlist/'+playlistId)
    }

    const songItems = songs.map((elem, index) => {
        return <ListItem key={elem.uri} 
                id={index}
                clickEvent={songClickEvent} 
                text={index+1 + ". " + elem.name + " - " + elem.artist}
                style={{marginBottom: index == songs.length-1 ? "0rem" : "1rem", textAlign: "left", fontSize: "1.8rem"}} />
        }
    )

    return (
        <div className="columns">
            <Header text="Add a song" />
            <input placeholder="Your name (Optional)" defaultValue={localStorage.getItem('addedSongUser') ? localStorage.getItem('addedSongUser') : ""} ref={inputField}  />
            <input placeholder="Search for a song" onChange={searchUpdate} />
            <div id="songoptions-wrapper" className={songItems.length ? "" : "columns"}>
                {songItems.length ? songItems : <div style={{padding: "5rem"}}>Tracks will appear here.</div>}
            </div>
            
        </div>
    )
}

export default AddSong
