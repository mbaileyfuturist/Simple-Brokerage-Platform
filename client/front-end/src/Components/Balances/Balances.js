import classes from './Balances.module.css'
import { useState, useEffect, Fragment} from 'react'
import axios from 'axios'
import Button from '../Button/Button'
import { useHistory } from 'react-router-dom'
import MainNavigation from '../MainNavigation/MainNavigation'

const Balances = () => {

    const history = useHistory()
    const myStorage = window.localStorage
    const id = myStorage.getItem('id')
    const idToken = myStorage.getItem('idToken')

    const [deposit, setDeposite] = useState('')
    const [withdraw, setWithdraw] = useState('')
    const [availableFunds, setAvailableFunds] = useState(0)
    const [totalHoldings, setTotalHoldings] = useState(0)
    const [totalAssets, setTotalAssets] = useState(0)
    const [error, setError] = useState('')

    useEffect(() => {

        const fetchBalances = async () => {

            try{

                const response = await axios.post('http://localhost:3001/Balances', {idToken:idToken, id:id})
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

    const changeDepositFunds = event => {
        setDeposite(parseInt(event.target.value))
    }

    const changeWithdrawFunds = event => {
        setWithdraw(parseInt(event.target.value))
    }

    const depositFunds = async event => {

        event.preventDefault();
        
        //Get the current available funds.
        let balances = {}
        try{

            const response = await axios.post('http://localhost:3001/Balances', {id:id, idToken:idToken})
            balances = response.data
            console.log(balances)
            balances.totalAvailableFunds = parseInt(balances.totalAvailableFunds) + deposit
            balances.totalAssets = parseInt(balances.totalAssets) + deposit
            
        }catch(error){
            console.log(error)
        }

        try{

            const totalAvailableFunds = balances.totalAvailableFunds
            const response = await axios.post('http://localhost:3001/totalAvailableFunds', {
                id:id,
                totalAvailableFunds: totalAvailableFunds,
                idToken:idToken
            })

            if(response.status !== 200){
                throw new Error('Failed to update Total Available Funds.')
            }

        }catch(error){
            console.log(error)
        }

        try{

            const totalAssets = balances.totalAssets
            const response = await axios.post('http://localhost:3001/totalAssets', {
                id:id,
                totalAssets: totalAssets,
                idToken:idToken
            })

            if(response.status !== 200){
                throw new Error('Failed to update total assets.')
            }


        }catch(error){
            console.log(error)
        }

        setDeposite('')

    }

    const withdrawFunds = async event => {

        event.preventDefault();

         //Get the current available funds.
         let balances = {}
         try{
 
             const response = await axios.post('http://localhost:3001/Balances', {idToken:idToken, id:id})
             balances = response.data
             
             if((balances.totalAvailableFunds - withdraw) < 0){
                setError('Insufficient funds for withdraw.')
             }else{
                 setError('')
                balances.totalAvailableFunds = parseInt(balances.totalAvailableFunds) - withdraw
                balances.totalAssets = parseInt(balances.totalAssets) - withdraw
             }
             
         }catch(error){
             console.log(error)
         }
 
         try{

            const totalAvailableFunds = balances.totalAvailableFunds
            const response = await axios.post('http://localhost:3001/totalAvailableFunds', {
                id:id,
                totalAvailableFunds:totalAvailableFunds,
                idToken:idToken
            })

            if(response.status !== 200){
                throw new Error('Unable to update Total Available Funds.')
            }
 
         }catch(error){
             console.log(error)
         }

         try{

            const totalAssets = balances.totalAssets
            const response = await axios.post('http://localhost:3001/totalAssets', {
                id:id,
                totalAssets:totalAssets,
                idToken:idToken
            })

            if(response.status !== 200){
                throw new Error('Unable to update Total Assets.')
            }

         }catch(error){
             console.log(error)
         }

         setWithdraw('')
 
    }

    const navigateBack = () => {
        history.push('/Home')
    }

    return(
       <Fragment>
           <MainNavigation />
            <div className={classes.BalancesContainer}>
            <div className={classes.TitleContainer}>
                <p className={classes.Title}>Balances</p>
            </div>
            <form className={classes.addFunds} onSubmit={withdrawFunds}>
                <p className={classes.Label}>Withdraw Funds</p>
                <input className={classes.Input} type='number' placeholder='$0.00' onChange={changeWithdrawFunds} value={withdraw}/>
                <Button value='Withdraw' type='submit' className={classes.Button}/>
            </form>
            <form className={classes.addFunds} onSubmit={depositFunds}>
                <p className={classes.Label}>Deposit Funds</p>
                <input className={classes.Input} type='number' placeholder='$0.00' onChange={changeDepositFunds} value={deposit}/>
                <Button value='Deposit' type='submit' className={classes.Button}/>
            </form>
            <div className={classes.viewBalances}>
                <p className={classes.Label}>Available Funds: ${availableFunds}</p>
                <p className={classes.Label}>Total Holdings: ${totalHoldings}</p>
                <p className={classes.Label}>Totoal Assets: ${totalAssets}</p>
            </div>
            <Button className={classes.Button + ' ' + classes.BottomButton} onClick={navigateBack} value='Back'/>
        </div>
        {error && <p className={classes.Error}>{error}</p>}
       </Fragment>
    )
}

export default Balances