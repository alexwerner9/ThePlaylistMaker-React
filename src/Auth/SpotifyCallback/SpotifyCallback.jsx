
import { useEffect } from 'react'
import { useNavigate } from "react-router-dom";

function SpotifyCallback(props) {
    const navigate = useNavigate();
    useEffect(() => {
        async function registerSpotify(code) {
            const res = await fetch(import.meta.env.VITE_API_URL+'/registerspotify?code='+code, {credentials: 'include'})
            const resJson = await res.json()
            if(resJson.userId) {
                localStorage.setItem('loginToken', resJson.loginToken)
                localStorage.setItem('username', resJson.userId)
                localStorage.setItem('isSpotifyUser', 'true')
            }
            const loginRedirectHref = localStorage.getItem('loginRedirectHref')
            localStorage.removeItem('loginRedirectHref')
            if(loginRedirectHref) {
                window.location.href = loginRedirectHref
            } else {
                window.location.href = "/"
            }
        }
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code')
        registerSpotify(code)
    }, [])

    return <></>
}

export default SpotifyCallback
