const Button = props => {
    return(
        <button type={props.type} onClick={props.onClick} className={props.className}>{props.value}</button>
    )
}

export default Button