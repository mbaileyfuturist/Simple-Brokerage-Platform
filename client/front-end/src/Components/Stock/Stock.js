import { useHistory } from 'react-router-dom'
import classes from './Stock.module.css'
import Button from '../Button/Button'
import axios from 'axios'

const Stock = props => {

    const history = useHistory()

    const addToWatchList = async () => {

        const stock = {
            id:props.ticker,
            ticker:props.ticker,
            name:props.name,
            type:props.type,
            watchList:true
        }

        const response = await axios.post('https://simple-brokerage-platfor-144bb-default-rtdb.firebaseio.com/watchlist.json',stock)
    }

    const removeFromWatchList = async () => {

        let foundStockId = ''
        try{

            const response = await axios.get('https://simple-brokerage-platfor-144bb-default-rtdb.firebaseio.com/watchlist.json')
            const watchList = response.data

            for(let stock in watchList){
                if(watchList[stock].id === props.ticker){
                    foundStockId = stock
                }
            }

        }catch(error){
            console.log(error)
        }

        try{
            const response = await axios.delete('https://simple-brokerage-platfor-144bb-default-rtdb.firebaseio.com/watchlist/' + foundStockId + '.json')
        }catch(error){
            console.log(error)
        }
    }

    const viewStock = () => {
        history.push('/ViewStock:' + props.ticker)
    }

    return(
        <div title={props.title} className={classes.stockContainer}>
            <div className={classes.textContainer}>
                <p className={classes.Title}>{props.ticker + ' ' + props.name + ' ' + props.type}</p> 
            </div>
            <div className={classes.buttonContainer}>
                {props.watchList ? <Button onClick={removeFromWatchList} className={classes.stockButton + ' ' + classes.firstButton} value={'Remove From Watchlist'}/> : <Button onClick={addToWatchList} className={classes.stockButton + ' ' + classes.firstButton} value={'Add To Watchlist'}/>}
                <Button onClick={viewStock} className={classes.stockButton + ' ' + classes.secondButton} value={'View'}/>
            </div>
        </div>
    )
}

export default Stock