
import { useEffect } from 'react'
import { useNavigate } from "react-router-dom";

function SpotifyCallback(props) {
    const navigate = useNavigate();
    useEffect(() => {
        async function registerSpotify(code) {
            console.log("CALLING")
            const res = await fetch('http://localhost:3000/registerspotify?code='+code)
            const resJson = await res.json()
            console.log(resJson)
            if(resJson.userId) {
                localStorage.setItem('loginToken', resJson.loginToken)
                localStorage.setItem('username', resJson.userId)
                localStorage.setItem('isSpotifyUser', 'true')
            }
            navigate('/')
        }
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code')
        registerSpotify(code)
    }, [])

    return <p>Loading...</p>
}

export default SpotifyCallback
