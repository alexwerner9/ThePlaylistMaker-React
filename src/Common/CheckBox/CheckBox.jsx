
import './CheckBox.css'

function CheckBox(props) {
    return (
        <div class="checkbox-wrapper-23">
            <input type="checkbox" id="check-23"/>
            <label for="check-23" style={{"--size": "30px"}}>
                <svg viewBox="0,0,50,50">
                <path d="M5 30 L 20 45 L 45 5"></path>
                </svg>
            </label>
        </div>
    )
}

export default CheckBox
