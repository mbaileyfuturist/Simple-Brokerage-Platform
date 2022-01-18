import classes from './TradeStock.module.css'
import { useState, useEffect } from 'react'
import Button from '../Button/Button'
import { useHistory, useParams } from 'react-router-dom'
import axios from 'axios'

const TradeStock = props => {

    const history = useHistory()
    const params = useParams()
    const ticker = params.symbol.substring(1)

    const [stock, setStock] = useState('')
    const [quote, setQuote] = useState('')
    const [marketOrder, setMarketOrder] = useState('Buy')
    const [quantity, setQuantity] = useState('')
    const [TIF, setTIF] = useState('Day-Only Order (DAY)')

    useEffect(() => {
      
      const getStock = async () => {

        try{

          const response = await axios.get('https://api.polygon.io/v3/reference/tickers/' + ticker + '?apiKey=f5oOL5pKLuXdr2SCQPzck75pLuOIt_4r')

          const data = response.data.results

          setStock(data)

        }catch(error){
          console.log(error)
        } 
      }

      const getQuote = async () => {

        try{

          const response = await axios.get('https://api.polygon.io/v2/aggs/ticker/' + ticker + '/prev?adjusted=true&apiKey=f5oOL5pKLuXdr2SCQPzck75pLuOIt_4r')

          const data = response.data.results

          setQuote(data[0].c)

        }catch(error){
          console.log(error)
        }
        
      }

      getStock()
      getQuote()
    }, [])

    const selectMarketOrder = event => {
      setMarketOrder(event.target.value)
    }

    const changeQuantity = event => {
      setQuantity(event.target.value)
    }

    const selectTIF = event => {
      setTIF(event.target.value)
    }

    const navigateBack = () => {
      history.push('/ViewStock:' + ticker)
    }

    const completeTransaction = async event => {

      event.preventDefault();
      
      const totalPrice = quote*quantity

      const transaction = { 
        ticker:ticker,
        quote:quote,
        quantity:quantity,
        marketOrder:marketOrder,
        totalPrice:totalPrice,
        TIF:TIF
      }

      try{

        const response = axios.post('https://simple-brokerage-platfor-144bb-default-rtdb.firebaseio.com/transactions.json', transaction)

      }catch(error){
        console.log(error)
      }

      setStock('')
      setMarketOrder('BUY')
      setQuantity('')
      setTIF('Day-Only Order (DAY)')

    }

    return (
        <div className='App'>

          <form onSubmit={completeTransaction} className={classes.transactionContainer}>
            <div className={classes.formHeader}>
            <p className={classes.formTitle}>{stock.ticker}</p>
            <p className={classes.formTitle}>{stock.name}</p>
            <p className={classes.formTitle}>${quote}</p>
            </div>

            <div>
              <p className={classes.Label}>Order Type</p>
              <select className={classes.Selector} id="market-order" onChange={selectMarketOrder} value={marketOrder}>
                <option value="Buy" defaultValue>Buy</option>
                <option value="Sell">Sell</option>
                <option value="Limit Buy">Limit Buy</option>
                <option value="Limit Sell">Limit Sell</option>
                <option value="Stop Buy">Stop Buy</option>
                <option value="Stop Sell">Stop Sell</option>
              </select>
            </div>

            <div>
              <input className={classes.Input} type='text' placeholder='Quantity' onChange={changeQuantity} value={quantity}/>
            </div>

            <div>
              <p className={classes.Label}><b>Total: $</b>{(quote*quantity).toFixed(2)}</p>
            </div>

            <div>
              <p className={classes.Label}>TIF</p>
              <select className={classes.Selector} id="TIF" onChange={selectTIF} value={TIF}>
                <option value="DAY" defaultValue>Day-Only Order (DAY)</option>
                <option value="FOK">Fill or Kill Order (FOK)</option>
                <option value="GTC">Until Cancelled Order (GTC)</option>
                <option value="IOC">Immediate or Cancel Order (IOC)</option>
                <option value="GDT">Good Until Date Order (GDT)</option>
              </select>
            </div>

            <div className={classes.buttonContainer}>
              <Button className={classes.stockButton + ' ' + classes.firstButton} onClick={navigateBack} value='Back'/>
              <Button className={classes.stockButton + ' ' +classes.secondButton} type='submit' value='Complete Transaction'/>
            </div>
          </form>

        </div>
      );
}

export default TradeStock