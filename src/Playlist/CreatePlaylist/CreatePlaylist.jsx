
import Button from '../../Common/Button/Button.jsx'
import React, {useState}    from 'react';
import { useNavigate } from "react-router-dom";
import Header from '../../Common/Header/Header.jsx'

function CreatePlaylist(props) {
    const navigate = useNavigate()
    const [error, setError] = useState("")
    
    async function createplaylistClickEvent() {
        const playlistName = document.getElementById('playlistName').value
        if(!playlistName) {
            setError("You must enter a name.")
            return
        }
        const loginToken = localStorage.getItem('loginToken')
        const resp = await fetch(import.meta.env.VITE_API_URL+'/createplaylist', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                loginToken: loginToken,
                playlistName: playlistName,
                isSpotifyUser: localStorage.getItem('isSpotifyUser') == 'true' ? true : false
            }),
            redirect: 'follow'
        })
        const respJson = await resp.json();
        if(respJson['error']) {
            console.log(respJson['error'])
        } else {
            const playlistId = respJson['playlistId']
            navigate('/playlist/'+playlistId)
        }
    }

    function enterPressed(evt) {
        if(evt.key == 'Enter') {
            createplaylistClickEvent()
        }
    }

    return (
        <div className="columns">
            <Header text="Create a playlist" />
            {error && <div className="error">{error}</div>}
            <input id="playlistName" placeholder="Playlist name" onKeyUp={enterPressed}/>
            <Button text="Create" clickEvent={createplaylistClickEvent} />
        </div>
    )
}

export default CreatePlaylist
