import './Button.css'

function Button(props) {
    const { clickEvent, id, text, ...rest } = props
    return (
        <button {...rest} onClick={clickEvent} id={id} className="custom-button">{text}</button>
    )
}

export default Button