
import LazyScroll from '../../Common/LazyScroll/LazyScroll.jsx'
import Track from '../Track/Track.jsx'
import './TrackPane.css'
import { useState, useRef } from 'react'

function TrackPane(props) {
    const playlist = props.playlist
    const numTracks = playlist.numTracks
    if(!numTracks || !props.tracks.length) {
        return <div id="track-pane" className="rows" style={props.style}>Tracks will appear here.</div>
    }
    if(props.playlistType == 'tpm') {
        return (
            <div id="track-pane" style={props.style}>
                <ol>
                    {props.tracks.map((elem, index) => {
                            return <li key={elem.spotifyUrl}>
                                        <Track 
                                            index={index+1} 
                                            name={elem.name} 
                                            artist={elem.artist} 
                                            spotifyUrl={elem.spotifyUrl} 
                                            addedBy={elem.addedBy} />
                                    </li>
                        })}
                </ol>
            </div>
        )
    }
    const playlistId = props.playlistId

    // initialize placeholders
    const tmpTracks = []
    for(let i = 0; i < numTracks; i++) {
        tmpTracks.push(<Track loading="true" key={i} index={i+1} />)
    }
    const loadedBlocks = useRef({})
    const [tracks, setTracks] = useState(tmpTracks)

    // populate the block of tracks
    async function loadBlock(blockno, newTracks) {
        const limit = 20
        const offset = blockno * limit
        let doneWork = false
        if(!loadedBlocks.current[blockno]) {
            doneWork = true
            const resp = await fetch(import.meta.env.VITE_API_URL+'/gettracksspotify?'+new URLSearchParams({
                offset: offset,
                limit: limit,
                playlistId: playlistId
            }), {credentials: 'include'})
            const respJson = await resp.json()
            for(let i = offset; i < offset+respJson.length; i++) {
                const track = respJson[i-offset]
                newTracks[i] = <Track spotifyUrl={track.spotifyUrl} index={i+1} key={i} name={track.name} artist={track.artist} addedBy={track.addedBy} />
                // newTracks[i] = <Track name="LOADED" artist="LOADED" addedBy="LOADED" loaded="true" />
            }
            loadedBlocks.current[blockno] = true
        }
        return  doneWork
    }

    // load blocks and populate
    async function onLazyScroll(firstLoadedIndex, lastLoadedIndex) {
        const firstBlock = Math.floor(firstLoadedIndex / 20)
        const lastBlock = Math.floor(lastLoadedIndex / 20)

        const newTracks = tracks.slice()
        const d1 = await loadBlock(firstBlock, newTracks)
        const d2 = await loadBlock(lastBlock, newTracks)
        if(d1 || d2) {
            setTracks(newTracks)
        }
    }
    
    const lazyScroll = numTracks ? <LazyScroll items={tracks} onLazyScroll={onLazyScroll} minHeight="67svh" /> : <></>
    return (
        <div id="track-pane" style={props.style}>
            {lazyScroll}
        </div>
    )
}

export default TrackPane
