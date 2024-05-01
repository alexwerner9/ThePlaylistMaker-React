
import './Divider.css'

function Divider(props) {
    const { direction, ...rest } = props
    return (
        <div {...rest} className={"divider-"+direction}>

        </div>
    )
}

export default Divider
