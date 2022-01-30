import classes from './TradeStock.module.css'
import { useState, useEffect } from 'react'
import Button from '../Button/Button'
import { useHistory, useParams } from 'react-router-dom'
import axios from 'axios'
import MainNavigation from '../MainNavigation/MainNavigation'

const TradeStock = props => {

    const history = useHistory()
    const params = useParams()
    const ticker = params.symbol.substring(1)
    const myStorage = window.localStorage
    const id = myStorage.getItem('id')
    const idToken = myStorage.getItem('idToken')

    const [stock, setStock] = useState('')
    const [quote, setQuote] = useState('')
    const [marketOrder, setMarketOrder] = useState('Buy')
    const [quantity, setQuantity] = useState('')
    const [TIF, setTIF] = useState('Day-Only Order (DAY)')
    const [error, setError] = useState(null)

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

      let totalPrice = quote*quantity
      
      //Check if there are available funds to make the order.
      try{

        if(marketOrder === 'BUY'){

          setError(null)

          const response = await axios.post('http://localhost:3001/Balances', {id:id, idToken:idToken})
          let balancesObject = response.data

          if(totalPrice < parseInt(balancesObject.totalAvailableFunds)){

            //Balance calculations
            balancesObject.totalAvailableFunds = parseInt(balancesObject.totalAvailableFunds) - totalPrice;
            balancesObject.totalHoldings = parseInt(balancesObject.totalHoldings) + totalPrice
                  
            //Update the new total
            const putResponse = await axios.post('http://localhost:3001/updateBalances', {balancesObject:balancesObject, id:id, idToken:idToken})

            //Make the order.
            const order = { 
              ticker:ticker,
              name:stock.name,
              quote:quote,
              quantity:quantity,
              marketOrder:marketOrder,
              totalPrice:totalPrice,
              TIF:TIF
            }

            try{

              const response = await axios.post('http://localhost:3001/orders', {order:order, id:id, idToken:idToken})

            }catch(error){
              console.log(error)
            }

          }else{
            setError('Insufficient funds, please add additional funds to complete the order.')
          }
        }

        if(marketOrder === 'Sell'){

          setError(null)

          const response = await axios.post('http://localhost:3001/getOrders', {id:id, idToken:idToken})
          let orderObjects = response.data

          console.log(orderObjects)

          let matchingOrders = []
          let matchingOrdersQuantitySum = 0
          for(let key in orderObjects){
            if(orderObjects[key].ticker === ticker){
              matchingOrders.push(orderObjects[key])
              matchingOrdersQuantitySum += orderObjects[key].quantity
            }
          }

          if(matchingOrdersQuantitySum > parseInt(quantity)){

           try{

            const getResponse = await axios.post('http://localhost:3001/Balances', {id:id, idToken:idToken})
            let balancesObject = getResponse.data

            //Balance Calculations
            balancesObject.totalHoldings = parseInt(balancesObject.totalHoldings) - totalPrice
            balancesObject.totalAvailableFunds = parseInt(balancesObject.totalAvailableFunds) + totalPrice
            
            const putResponse = await axios.post('http://localhost:3001/updateBalances', {id:id, balancesObject:balancesObject, idToken:idToken})

           }catch(error){
             console.log(error)
           }

            try{

              const order = { 
                ticker:ticker,
                name:stock.name,
                quote:quote,
                quantity:quantity,
                marketOrder:marketOrder,
                totalPrice:totalPrice,
                TIF:TIF
              }
  
              const putResponse = await axios.post('http://localhost:3001/orders', {id:id, order:order, idToken:idToken})

            }catch(error){
              console.log(error)
            }

          }else{
             setError('Insufficient number of stocks, please select a valid quantity to sell.')
          }
        }

      }catch(error){
        console.log(error)
      }

      setStock('')
      setMarketOrder('BUY')
      setQuantity('')
      setTIF('Day-Only Order (DAY)')

    }

    return (
        <div>
          <MainNavigation />
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
                {/* <option value="Limit Buy">Limit Buy</option>
                <option value="Limit Sell">Limit Sell</option>
                <option value="Stop Buy">Stop Buy</option>
                <option value="Stop Sell">Stop Sell</option> */}
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
              <Button disabled={quantity === ''} className={classes.stockButton + ' ' + classes.secondButton} type='submit' value='Complete Transaction'/>
            </div>
          </form>
          {error && <p className={classes.error}>{error}</p>}

        </div>
      );
}

export default TradeStock