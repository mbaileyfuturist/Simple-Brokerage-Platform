import { useState, useEffect, Fragment } from 'react'
import axios from 'axios'
import Stock from '../Stock/Stock'
import classes from './Home.module.css'
import Button from '../Button/Button'
import { Link } from 'react-router-dom'

const Home = () => {

    const [securities, setSecurities] = useState([])
    const [searchSecurity, setSearchSecurity] = useState('')
    const [watchList, setWatchList] = useState([])

    useEffect(() => {

        const getSecurities = async () => {

            try{

                const response = await axios.get('https://api.polygon.io/v3/reference/tickers?type=CS&market=stocks&active=true&sort=ticker&order=asc&limit=1000&apiKey=f5oOL5pKLuXdr2SCQPzck75pLuOIt_4r')

                const securities = response.data.results

                setSecurities(securities)

            }catch(error){
                console.log(error)
            }
        }

        getSecurities()

        const getWatchList = async () => {

            let populated = false
            
            const response = await axios.get('https://simple-brokerage-platfor-144bb-default-rtdb.firebaseio.com/watchlist.json')
            const fetchedWatchlist = response.data

            let watchListArray = []
            for(let security in fetchedWatchlist){
                watchListArray.push({
                    id:security,
                    ...fetchedWatchlist[security]
                })
            }

            setWatchList(watchListArray)

            return populated
        }

        getWatchList()

    }, [])

    const changeSecurity = event => {
        setSearchSecurity(event.target.value)
    }

    const searchStock = async () => {

        if(searchSecurity !== ''){
            try{
                const response = await axios.get('https://api.polygon.io/v3/reference/tickers/' + searchSecurity + '?apiKey=f5oOL5pKLuXdr2SCQPzck75pLuOIt_4r')

                const searchedTicker = response.data.results

                let securitiesArray = []
                securitiesArray.push(searchedTicker)
                setSecurities(securitiesArray)
                
            }catch(error){
                console.log(error)
            }
        }else{
            const response = await axios.get('https://api.polygon.io/v3/reference/tickers?type=CS&market=stocks&active=true&sort=ticker&order=asc&limit=1000&apiKey=f5oOL5pKLuXdr2SCQPzck75pLuOIt_4r')
            const securities = response.data.results

            setSecurities(securities)
        }
    }


  return(
    <Fragment>
        <div className={classes.NavWrapper}>
            <div className={classes.NavOne}>
                <p className={classes.AppTitle}>Simple Brokerage Platform</p>
            </div>
            <div className={classes.NavTwo}>
                <Link to='/PreviousOrders'><p className={classes.previousOrdersTitle}>Previous Orders</p></Link>
            </div>
            <div className={classes.NavThree}>
                <input className={classes.Search} placeholder={'search symbol'} onChange={changeSecurity}/>
                <Button className={classes.searchButton} value='Search' onClick={searchStock}/>
            </div>
        </div>

        <div className={classes.ListWrapper}>
            
            <div className={classes.ListOne}>
                <p className={classes.title}>Securities</p>
                {
                    securities.map(security => {
                        return <Stock key={security.ticker} ticker={security.ticker} name={security.name} type={security.type} />
                    })
                }
            </div>

            <div className={classes.LsitTwo}>
                <p className={classes.title}>Watch List</p>
                {
                    watchList.map(security => {
                        return <Stock key={security.ticker} ticker={security.ticker} name={security.name} type={security.type} watchList={security.watchList}/>
                    })
                }
            </div>
           
        </div>  
    </Fragment>
        
  )
}

export default Home