import axios from 'axios'
import { useEffect, useState } from 'react'
import PreviousStock from '../PreviousStock/PreviousStock'
import classes from './PreviousOrders.module.css'
import Button from '../Button/Button'
import { useHistory } from 'react-router-dom'

const PreviousOrders = () => {

    const [previousOrders, setPreviousOrders] = useState([])
    const history = useHistory()

    useEffect(() => {

        const fetchData = async () => {

            try{

                const response = await axios.get('https://simple-brokerage-platfor-144bb-default-rtdb.firebaseio.com/transactions.json')
                const previousOrders = response.data

                let prevOrdersArray = []
                for(let prevOrder in previousOrders){
                    prevOrdersArray.push(previousOrders[prevOrder])
                }

                setPreviousOrders(prevOrdersArray)

            }catch(error){
                console.log(error)
            }
        }

        fetchData()

    }, [])

    const navigateBack = () => {
        history.push('/Home')
    }

    return(
        <div>
            <h1 className={classes.title}>Previous Stocks</h1>
            {previousOrders.map(previousOrder => {
                return <PreviousStock key={previousOrder.ticker} ticker={previousOrder.ticker} name={previousOrder.name} quote={previousOrder.quote} marketOrder={previousOrder.marketOrder} 
                        quantity={previousOrder.quantity} totalPrice={previousOrder.totalPrice}/>
            })}
            <div className={classes.buttonContainer}>
            <Button className={classes.Button} value='back' onClick={navigateBack}/>
            </div>
        </div>
    )
}

export default PreviousOrders