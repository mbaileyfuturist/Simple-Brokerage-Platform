import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import classes from './ViewStock.module.css'
import Button from '../Button/Button'
import { useHistory } from 'react-router-dom'

const ViewStock = props => {

    const params = useParams()
    const ticker = params.symbol.substring(1)
    const history = useHistory()
    const [stock, setStock] = useState({})

    useEffect(() => {

        const fetchStock = async () => {
            const response = await axios.get('https://api.polygon.io/v3/reference/tickers/' + ticker + '?apiKey=f5oOL5pKLuXdr2SCQPzck75pLuOIt_4r')

            const data = response.data.results

            setStock(data)

        }

        fetchStock()
    }, [])

    const navigateBack = () => {
        history.push('/Home')
    }

    const tradeStock = () => {
        history.push('/TradeStock:' + ticker)

    }

    return(
        <div className={classes.stockContainer}>
            <div className={classes.cardHeader}>
                <p className={classes.cardTitle}>{stock.ticker}</p>
                <p className={classes.cardTitle}>{stock.name}</p>
            </div>
            <p className={classes.description}>{stock.description}</p>
            <div className={classes.buttonContainer}>
                <Button className={classes.stockButton + ' ' + classes.firstButton} value='Back' onClick={navigateBack}/>
                <Button className={classes.stockButton + ' ' + classes.secondButton} value='Trade' onClick={tradeStock}/>
            </div>
        </div>
    )
}

export default ViewStock