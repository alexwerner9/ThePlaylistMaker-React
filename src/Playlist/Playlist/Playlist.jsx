
import React, { Component, useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../Common/Header/Header.jsx'
import TrackPane from '../TrackPane/TrackPane.jsx'
import Button from '../../Common/Button/Button.jsx'
import Divider from '../../Common/Divider/Divider.jsx'
import LazyScroll from '../../Common/LazyScroll/LazyScroll.jsx';
import './Playlist.css'
import { useMediaQuery } from 'react-responsive'
import Modal from 'react-modal';

Modal.setAppElement('#root')

function Playlist() {
    const navigate = useNavigate()
    const { playlistId } = useParams();
    const [playlist, setPlaylist] = useState({})
    const [tracks, setTracks] = useState([])
    const [isOwner, setIsOwner] = useState(false)
    const [playlistType, setPlaylistType] = useState('tpm')
    const [copyButtonText, setCopyButtonText] = useState("Copy share link")
    const [playlistExists, setPlaylistExists] = useState(true)
    const [loaded, setLoaded] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    playlist.tracks = []

    const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })

    const modalStyles = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: "rgb(30,30,30)",
          maxWidth: "80vw"
        },
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(25, 25, 25, 0.9)',
            zIndex: 9999
          },
      };

    useEffect(() => {
        async function getPlaylist() {
            const resp = await fetch(import.meta.env.VITE_API_URL+'/getplaylist?'+new URLSearchParams({
                playlistId: playlistId,
                loginToken: localStorage.getItem('loginToken')
            }), 
            {
                redirect: 'follow',
                credentials: 'include'
            })
            const respJson = await resp.json()
            if(respJson.error) {
                setPlaylistExists(false)
                return
            }
            const isOwner = respJson.isOwner
            const fetchedPlaylist = respJson.playlist
            
            setPlaylist(fetchedPlaylist)
            setTracks(fetchedPlaylist.tracks)
            setPlaylistType(respJson.type) // spotify or tpm
            setIsOwner(isOwner)
            setLoaded(true)
        }
        getPlaylist()
    }, [])

    async function deletePlaylist() {
        const resp = await fetch(import.meta.env.VITE_API_URL+'/deleteplaylist', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                playlistId: playlistId,
                loginToken: localStorage.getItem('loginToken')
            }),
            redirect: 'follow',
            credentials: 'include'
        })
        const respJson = await resp.json()
        navigate('/myplaylists')
    }

    function copyLink() {
        const copyText = window.location.href
        const element = document.createElement("textarea");
        element.value = copyText;
        document.body.appendChild(element)
        element.select();
        document.execCommand("copy");
        document.body.removeChild(element);
        setCopyButtonText("Copied!")
        setTimeout(() => setCopyButtonText("Copy share link"), 1500)
    }

    let changingButton = isOwner ? <Button text="Delete" style={
        {
            border: "1px solid red"
        }
    } clickEvent={() => {setDeleteModalOpen(true)}} /> : <Button text="Create your own" clickEvent={() => {navigate('/createplaylist')}} />

    const modal = (
        <Modal isOpen={deleteModalOpen} style={modalStyles} closeTimeoutMS={100}>
            <div className="columns">
                <Header text="Are you sure you want to delete this playlist?" />
                <div className="rows">
                    <Button text="Delete" style={{border: "1px solid red"}} clickEvent={deletePlaylist} />
                    <Button text="Cancel" clickEvent={() => {setDeleteModalOpen(false)}} />
                </div>
                {playlistType == 'spotify' ? <p style={{fontSize: "1.3rem", color: "white", marginTop: "2rem", marginBottom: "0rem"}}>Note that this will not delete your playlist from Spotify.</p> : <></>}
            </div>
        </Modal>)

    if(!loaded) {
        changingButton = <></>
    }

    function renamePlaylistEnter(evt) {
    }

    function renamePlaylistLeave(evt) {
    }

    function renamePlaylistClick(evt) {
        
    }

    if(!playlistExists) {
        return <p>This playlist does not exist or is private.</p>
    }

    if(isPortrait) {
        return (
            <div className="columns">
                {modal}
                <Header text={playlist.playlistName ? playlist.playlistName : "-"} loading={!playlist.playlistName} />
                <TrackPane style={{marginBottom: "3rem"}} tracks={tracks} type={playlistType} playlistId={playlistId} playlist={playlist} />
                <div className="columns">
                    <div className="rows">
                        <Button clickEvent={() => navigate('/addsong/'+playlistId)} text="Add a song" id="add-song" />
                        <Button text={copyButtonText} clickEvent={copyLink} />
                    </div>
                    {changingButton}
                </div>
                
            </div>
        )
    }

    return (
        <div className="columns">
            <Header text={playlist.playlistName ? playlist.playlistName : "-"} onMouseEnter={renamePlaylistEnter} onMouseLeave={renamePlaylistLeave} loading={!playlist.playlistName} />
            <div className="rows">
                <div className="columns" id="left-panel" style={{minWidth: "20rem"}}>
                    {modal}
                    <Button clickEvent={() => navigate('/addsong/'+playlistId)} text="Add a song" id="add-song" />
                    <Divider direction="row" />
                    <Button text={copyButtonText} clickEvent={copyLink} />
                    {changingButton}
                </div>
                <TrackPane tracks={tracks} type={playlistType} playlistId={playlistId} playlist={playlist} />
            </div>
        </div>
    )
}

export default Playlist
