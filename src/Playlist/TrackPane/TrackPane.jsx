
import LazyScroll from '../../Common/LazyScroll/LazyScroll.jsx'
import Track from '../Track/Track.jsx'
import './TrackPane.css'
import { useState, useRef } from 'react'
import Button from '../../Common/Button/Button.jsx'

function TrackPane(props) {
    const playlist = props.playlist
    const numTracks = playlist.numTracks
    const passedTracks = props.tracks
    if(!numTracks || !passedTracks) {
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

    const limit = 20
    // initialize placeholders
    const loadedBlocks = useRef({})
    const tmpTracks = []
    // if we've loaded all tracks, use them. otherwise, load in blocks
    const numTracksAlreadyLoaded = passedTracks.length == numTracks ? passedTracks.length : Math.floor(passedTracks.length / limit)*limit
    for(let i = 0; i < numTracksAlreadyLoaded; i++) {
        const track = passedTracks[i]
        tmpTracks.push(<Track spotifyUrl={track.spotifyUrl} index={i+1} key={i} name={track.name} artist={track.artist} addedBy={track.addedBy} />)
        const blockNo = Math.floor(i / 20)
        loadedBlocks.current[blockNo] = true;
    }
    for(let i = numTracksAlreadyLoaded; i < numTracks; i++) {
        tmpTracks.push(<Track loading="true" key={i} index={i+1} />)
    }
    const [tracks, setTracks] = useState(tmpTracks)

    // populate the block of tracks
    async function loadBlock(blockno, newTracks) {
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

    const lazyScrollRef = useRef()
    const [scrollDir, setScrollDir] = useState('down')
    function scrollDown() {
        const scroller = lazyScrollRef.current
        scroller.scrollTo({top: scroller.scrollHeight, behavior: 'smooth'})
        setScrollDir('up')
    }
    function scrollUp() {
        const scroller = lazyScrollRef.current
        scroller.scrollTo({top: 0, behavior: 'smooth'})
        setScrollDir('down')
    }

    const downButton = <Button id="scroll-button" clickEvent={scrollDown} child={<i class="fa fa-arrow-down"></i>}/>
    const upButton = <Button id="scroll-button" clickEvent={scrollUp} child={<i class="fa fa-arrow-up"></i>}/>
    const scrollButton = scrollDir == 'down' ? downButton : upButton

    return (
        <div id="track-pane" style={props.style}>
            <LazyScroll forwardRef={lazyScrollRef} items={tracks} onLazyScroll={onLazyScroll} minHeight="67svh" />
            {tracks.length > 50 ? scrollButton : <></>}
        </div>
    )
}

export default TrackPane
