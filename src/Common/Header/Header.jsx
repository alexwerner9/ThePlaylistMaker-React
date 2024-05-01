import './Header.css'

function Header(props) {
    const {text, loading, ...rest} = props
    if(loading) {
        return (
            <div className="loading-header" />
        )
    }
    return (
        <div>
            <p className="header" {...rest}>{text}</p>
        </div>
    )
}

export default Header