import classes from './PreviousStock.module.css'
import { useHistory } from 'react-router-dom'
import Button from '../Button/Button'

const PreviousStock = props => {

    const history = useHistory()

    const navigateBack = () =>{
        history.push('/Home')
    }

    return(
            <div className={classes.stockContainer}>
                <p className={classes.stockText}>{props.ticker + ' ' + props.name}</p>
                <p className={classes.stockText}>${props.quote.toFixed(2)}</p>
                <p className={classes.stockText}>{props.quantity}</p>
                <p className={classes.stockText}>{props.marketOrder + ': ' + props.totalPrice}</p>
            </div>
    )
}

export default PreviousStock