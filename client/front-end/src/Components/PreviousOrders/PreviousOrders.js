import axios from 'axios'
import { useEffect, useState } from 'react'
import PreviousOrder from '../PreviousOrder/PreviousOrder'
import classes from './PreviousOrders.module.css'
import Button from '../Button/Button'
import { useHistory } from 'react-router-dom'
import MainNavigation from '../MainNavigation/MainNavigation'

const PreviousOrders = () => {

    const [previousOrders, setPreviousOrders] = useState([])
    const history = useHistory()

    const myStorage = window.localStorage
    const id = myStorage.getItem('id')
    const idToken = myStorage.getItem('idToken')

    useEffect(() => {

        const fetchData = async () => {

            try{

                const response = await axios.post('http://localhost:3001/getOrders', {id:id, idToken:idToken})
                const previousOrders = response.data
                console.log(response.data)

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
            <MainNavigation />
            <h1 className={classes.title}>Previous Orders</h1>
            {previousOrders.map(previousOrder => {
                return <PreviousOrder key={Math.random()} ticker={previousOrder.ticker} name={previousOrder.name} quote={previousOrder.quote} marketOrder={previousOrder.marketOrder} 
                        quantity={previousOrder.quantity} totalPrice={previousOrder.totalPrice}/>
            })}
            <div className={classes.buttonContainer}>
            <Button className={classes.Button} value='Back' onClick={navigateBack}/>
            </div>
        </div>
    )
}

export default PreviousOrders