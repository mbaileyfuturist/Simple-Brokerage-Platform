const Button = props => {
    return(
        <button title={props.title} disabled={props.disabled} type={props.type} onClick={props.onClick} className={props.className}>{props.value}</button>
    )
}

export default Button