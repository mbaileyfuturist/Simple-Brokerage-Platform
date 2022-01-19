import classes from './PreviousOrder.module.css'

const PreviousOrders = props => {

    return(
            <div className={classes.stockContainer}>
                <p className={classes.stockText}>{props.ticker}</p>
                <p className={classes.stockText}>Quote: ${props.quote.toFixed(2)}</p>
                <p className={classes.stockText}>Quantity: {props.quantity}</p>
                <p className={classes.stockText}>{props.marketOrder + ': ' + props.totalPrice.toFixed(2)}</p>
            </div>
    )
}

export default PreviousOrders