import classes from './PreviousStock.module.css'

const PreviousStock = props => {
    return(
            <div className={classes.cardContainer}>
                <p>{props.ticker}</p>
                <p>{props.name}</p>
                <p>{props.quote}</p>
                <p>{props.quantity}</p>
                <p>{props.marketOrder + ': ' + props.totalPrice}</p>
            </div>
    )
}

export default PreviousStock