import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Link } from 'react-router-dom'
import classes from './MainNavigation.module.css'

const MainNavigation = props => {

    const history = useHistory()
    const myStorage = window.localStorage

    const logout = () => {
        myStorage.removeItem('id')
        myStorage.removeItem('tokenId')
        history.push('/')
    }

    return(
        <div className={classes.NavWrapper} location='Home'>
            <div className={classes.NavOne}>
                <Link to='/PreviousOrders'><p className={classes.previousOrdersTitle}>Previous Orders</p></Link>
            </div>
            <div className={classes.NavTwo}>
                {props.location === 'Home' ? props.searchContent : <Link to='/Home'><p className={classes.homeTitle}>Home</p></Link>}
            </div>
            <div className={classes.NavThree}>
                <Link to='/Balances'><p className={classes.balancesTitle}>Balances</p></Link>
            </div>
            <div className={classes.NavFour}>
                <p className={classes.logoutTitle} onClick={logout}>Logout</p>
            </div>
        </div>
    )

}

export default MainNavigation