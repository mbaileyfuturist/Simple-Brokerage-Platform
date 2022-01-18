import classes from './Balances.module.css'
import { useState, useEffect} from 'react'
import axios from 'axios'
import Button from '../Button/Button'
import { useHistory } from 'react-router-dom'

const Balances = () => {

    const history = useHistory()

    const [deposit, setDeposite] = useState('')
    const [withdraw, setWithdraw] = useState(0)
    const [availableFunds, setAvailableFunds] = useState(0)
    const [totalHoldings, setTotalHoldings] = useState(0)
    const [totalAssets, setTotalAssets] = useState(0)

    useEffect(() => {

        const fetchBalances = async () => {

            try{

                const response = await axios.get('https://simple-brokerage-platfor-144bb-default-rtdb.firebaseio.com/Balances.json')
                const dataObject = response.data
                
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
        setDeposite(parseInt(event.target.value))
    }

    const depositFunds = async event => {

        event.preventDefault();
        
        //Get the current available funds.
        let balances = {}
        try{

            const response = await axios.get('https://simple-brokerage-platfor-144bb-default-rtdb.firebaseio.com/Balances.json')
            balances = response.data
            balances.totalAvailableFunds = parseInt(balances.totalAvailableFunds) + deposit
            balances.totalAssets = parseInt(balances.totalAssets) + deposit
            
        }catch(error){
            console.log(error)
        }

        try{

            const responseOne = await axios.put('https://simple-brokerage-platfor-144bb-default-rtdb.firebaseio.com/Balances/totalAvailableFunds.json', balances.totalAvailableFunds)
            const responseTwo = await axios.put('https://simple-brokerage-platfor-144bb-default-rtdb.firebaseio.com/Balances/totalAssets.json', balances.totalAssets)

        }catch(error){
            console.log(error)
        }

        setDeposite('')

    }

    const withdrawFunds = async () => {

    }

    const navigateBack = () => {
        history.push('/Home')
    }

    return(
        <div className={classes.BalancesContainer}>
            <div className={classes.TitleContainer}>
                <p className={classes.Title}>Balances</p>
            </div>
            <form className={classes.addFunds} onSubmit={depositFunds}>
                <p className={classes.Label}>Add funds</p>
                <input className={classes.Input} type='text' placeholder='$0.00' onChange={changeAddFunds} value={deposit}/>
                <Button value='Deposit' type='submit' className={classes.Button}/>
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