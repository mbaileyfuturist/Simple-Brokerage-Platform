import './App.css';
import { Fragment } from 'react'
import Home from './Components/Home/Home'
import { Route, Redirect, Switch } from 'react-router-dom';
import ViewStock from './Components/ViewStock/ViewStock';
import TradeStock from './Components/TradStock/TradeStock'
import PreviousOrders from './Components/PreviousOrders/PreviousOrders'
import Balances from './Components/Balances/Balances'

function App() {

 return(
   <Fragment>

     <Switch>
      <Route path='/' exact>
          <Redirect to='/Home'/>
      </Route>

      <Route path='/Home'>
          <Home />
      </Route>

      <Route path='/ViewStock:symbol'>
        <ViewStock />
      </Route>

      <Route path='/TradeStock:symbol'>
        <TradeStock />
      </Route>

      <Route path='/PreviousOrders'>
        <PreviousOrders />
      </Route>

      <Route path='/Balances'>
        <Balances />
      </Route>
     </Switch>


   </Fragment>
 )
}

export default App;
