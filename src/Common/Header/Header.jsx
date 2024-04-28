import './Header.css'

function Header(props) {
    const {text, ...rest} = props
    return (
        <div>
            <p className="header" {...props}>{text}</p>
        </div>
    )
}

export default Header