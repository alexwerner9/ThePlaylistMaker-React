import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App/App.jsx'
import Login from './Auth/Login/Login.jsx'
import LoggedIn from './Home/LoggedIn/LoggedIn.jsx'
import CreateAccount from './Auth/CreateAccount/CreateAccount.jsx'
import CreatePlaylist from './Playlist/CreatePlaylist/CreatePlaylist.jsx'
import Playlist from './Playlist/Playlist/Playlist.jsx'
import MyPlaylists from './Playlist/MyPlaylists/MyPlaylists.jsx'
import AddSong from './Playlist/AddSong/AddSong.jsx'
import Button from './Common/Button/Button.jsx'
import './index.css'
import { isLoggedIn } from './auth.js'
import SpotifyCallback from './Auth/SpotifyCallback/SpotifyCallback.jsx'
import RecentlyContributed from './Playlist/RecentlyContributed/RecentlyContributed.jsx'

import {
  Navigate, BrowserRouter,
  Routes, Route
} from "react-router-dom";

function ProtectedRoute(props) {
    if(!localStorage.getItem('loginToken')) {
      localStorage.setItem('loginRedirectHref', props.path)
      return <Navigate to="/login" replace />;
    }
    return props.child;
}

function logoutOnClick() {
    localStorage.clear()
    window.location.href = "/"
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <button className="btn custom-button home" id="home-button" onClick={() => {window.location.href="/"}}><i className="fa fa-home"></i></button>
    <button className="custom-button log-out" id="log-out" style={{display: isLoggedIn() ? "auto" : "none"}} onClick={logoutOnClick}>Log out</button>
    <BrowserRouter>
      <Routes>
        <Route index element={<App />}></Route>
        <Route path="login" element={<Login />} />
        <Route path="createaccount" element={<CreateAccount />} />
        <Route path="myaccount" element={
          <ProtectedRoute path="myaccount" child={<LoggedIn />} />
        } />
        <Route path="createplaylist" element={
          <ProtectedRoute path="createplaylist" child={<CreatePlaylist />} />
        } />
        <Route path="playlist/:playlistId" element={
          <Playlist />
        } />
        <Route path="addsong/:playlistId" element={
          <AddSong />
        } />
        <Route path="myplaylists" element={
          <ProtectedRoute path="myplaylists" child={<MyPlaylists />} />
        } />
        <Route path="recentlycontributed" element={<RecentlyContributed />} />
        <Route path="spotifycallback" element={
          <SpotifyCallback />
        } />
      </Routes>
    </BrowserRouter>
  </>
)
