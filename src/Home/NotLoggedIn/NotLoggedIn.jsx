import Button from '../../Common/Button/Button.jsx'
import Header from '../../Common/Header/Header.jsx'
import Divider from '../../Common/Divider/Divider.jsx'
import { useNavigate } from "react-router-dom";

function NotLoggedIn() {
    const navigate = useNavigate();
    const createaccountOnClick = () => {
        navigate('/createaccount')
    }

    const loginOnClick = evt => {
        navigate('/login')
    }

    const loginSpotifyOnClick = evt => {
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

    const recentPlaylistsClickEvent = evt => {
        navigate('/recentlycontributed')
    }

    return (
        <div id="main-div">
        <Header text="Welcome!" />
        <Button text="Log in / Create account" clickEvent={loginOnClick} />
        <p class="small-white">Or</p>
        <Button text="Log in with Spotify" clickEvent={loginSpotifyOnClick} />
        <Divider direction="row" />
        <Button text="Recent playlists" clickEvent={recentPlaylistsClickEvent} />
    </div>
    )
}

export default NotLoggedIn
