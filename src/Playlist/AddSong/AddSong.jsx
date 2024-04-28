
import React, { Component, useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../Common/Header/Header.jsx'
import Button from '../../Common/Button/Button.jsx'
import CheckBox from '../../Common/CheckBox/CheckBox.jsx';

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
            const resp = await fetch(import.meta.env.VITE_API_URL+'/search?name='+evt.target.value);
            const respJson = await resp.json()
            setSongs(respJson);
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
            })
        })
        const respJson = await resp.json()
        navigate('/playlist/'+playlistId)
    }

    return (
        <div className="columns">
            <Header text="Add a song" />
            <input placeholder="Your name (Optional)" ref={inputField} />
            <input placeholder="Search for a song" onChange={searchUpdate} />
            {songs.map((elem, index) => {
                return <Button key={elem.uri} 
                        id={index}
                        clickEvent={songClickEvent} 
                        text={elem.name + " - " + elem.artist} />
                }
            )}
        </div>
    )
}

export default AddSong
