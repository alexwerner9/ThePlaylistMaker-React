import './ListItem.css'

function ListItem(props) {
    const { clickEvent, ...restProps} = props
    return (
        <div className="list-item" onClick={clickEvent} {...restProps}>
            {props.text}
        </div>
    )
}

export default ListItem
