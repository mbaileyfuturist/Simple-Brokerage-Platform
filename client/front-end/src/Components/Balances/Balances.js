import classes from './Balances.module.css'
import { useState, useEffect} from 'react'
import axios from 'axios'
import Button from '../Button/Button'
import { useHistory } from 'react-router-dom'

const Balances = () => {

    const history = useHistory()

    const [newFunds, setNewFunds] = useState('')
    const [availableFunds, setAvailableFunds] = useState(0)
    const [totalHoldings, setTotalHoldings] = useState(0)
    const [totalAssets, setTotalAssets] = useState(0)

    useEffect(() => {

        const fetchBalances = async () => {

            try{

                const response = await axios.get('https://simple-brokerage-platfor-144bb-default-rtdb.firebaseio.com/Balances.json')
                const dataObject = response.data

                console.log(dataObject)
                
                setAvailableFunds(dataObject.totalAvailableFunds)
                setTotalHoldings(dataObject.totalHoldings)
                setTotalAssets(dataObject.totalAssets)

            }catch(error){
                console.log(error)
            }
        }

        fetchBalances()
    },[])

    const changeAddFunds = event => {
        setNewFunds(parseInt(event.target.value))
    }

    const addFunds = async event => {

        event.preventDefault();
        
        //Get the current available funds.
        let totalAvailableFunds = 0
        try{

            const response = await axios.get('https://simple-brokerage-platfor-144bb-default-rtdb.firebaseio.com/Balances/totalAvailableFunds.json')
            const currentAvailableBalance = response.data
            console.log(currentAvailableBalance)
            totalAvailableFunds = currentAvailableBalance + newFunds
            
        }catch(error){
            console.log(error)
        }

        try{

            const response = await axios.put('https://simple-brokerage-platfor-144bb-default-rtdb.firebaseio.com/Balances/totalAvailableFunds.json', totalAvailableFunds)

        }catch(error){
            console.log(error)
        }

    }

    const navigateBack = () => {
        history.push('/Home')
    }

    return(
        <div className={classes.BalancesContainer}>
            <div className={classes.TitleContainer}>
                <p className={classes.Title}>Balances</p>
            </div>
            <form className={classes.addFunds} onSubmit={addFunds}>
                <p className={classes.Label}>Add funds</p>
                <input className={classes.Input} type='text' placeholder='$0.00' onChange={changeAddFunds} value={newFunds}/>
                <Button value='Add Funds' type='submit' className={classes.Button}/>
            </form>
            <div className={classes.viewBalances}>
                <p className={classes.Label}>Available Funds: ${availableFunds}</p>
                <p className={classes.Label}>Total Holdings: ${totalHoldings}</p>
                <p className={classes.Label}>Totoal Assets: ${totalAssets}</p>
            </div>
            <Button className={classes.Button + ' ' + classes.BottomButton} onClick={navigateBack} value='Back'/>
        </div>
    )
}

export default Balances