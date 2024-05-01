import './Track.css'

function Track(props) {
    function clickEvent() {
        if(props.spotifyUrl) {
            window.open(props.spotifyUrl, '_blank').focus()
        } else {
            alert("No link found for this track. It was probably added before links were implemented.")
        }
    }
    if(props.loading) {
        return (
            <div className="track loading">
                <div className="placeholder-name loading" />
                <div className="placeholder-added-by loading" />
            </div>
        )
    }
    return (
        <div className={props.loading ? "track loading" : "track"} onClick={clickEvent}>
            <div className="track-info">{props.index}. {props.name} - <em>{props.artist}</em></div>
            <div className="added-by">Added by: {props.addedBy}</div>
        </div>
    )
}

export default Track
