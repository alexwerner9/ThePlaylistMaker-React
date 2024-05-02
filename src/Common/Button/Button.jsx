import './Button.css'

function Button(props) {
    const { clickEvent, id, text, child, ...rest } = props
    return (
        <button {...rest} onClick={clickEvent} id={id} className="custom-button">{child ? child : text}</button>
    )
}

export default Button