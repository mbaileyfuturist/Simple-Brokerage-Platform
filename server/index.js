const express = require('express')
const app = express()
const cors = require('cors');
// const path = require('path')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

app.use(express.json())
app.use(cors())

app.get('/Balances', async (req, res) => {

   try{

        const response = await fetch('https://simple-brokerage-platfor-144bb-default-rtdb.firebaseio.com/Balances.json')

        if(response.status !== 200){
            throw new Error('Failed to fetch balances.')
        }

        const dataObject = await response.json()

        res.send(dataObject)

   }catch(error){
       console.log(error)
   }
})

app.put('/totalAvailableFunds', async (req, res) => {

    const totalAvailableFunds = req.body.totalAvailableFunds

    try{

        const response = await fetch('https://simple-brokerage-platfor-144bb-default-rtdb.firebaseio.com/Balances/totalAvailableFunds.json', {
        method:'PUT',
        headers:{
            'Content-Type':'application/json'
        },    
        body:JSON.stringify(parseInt(totalAvailableFunds))
        })

        if(response.status !== 200){
            throw new Error('Unable to update total available funds.')
        }

        res.sendStatus(response.status)

    }catch(error){
        console.log(error)
    }
})

app.put('/totalAssets', async (req, res) => {

    const totalAssets = req.body.totalAssets

    console.log('Total Assets: ' + totalAssets)

    try{

        const response = await fetch('https://simple-brokerage-platfor-144bb-default-rtdb.firebaseio.com/Balances/totalAssets.json', {
        method:'PUT',
        headers:{
            'Content-Type':'application/json'
        },    
        body:JSON.stringify(parseFloat(totalAssets))
        })

        if(response.status !== 200){
            throw new Error('Unable to update total available funds.')
        }

        res.sendStatus(response.status)

    }catch(error){
        console.log(error)
    }
})

app.put('/updateBalances', async (req, res) => {

    const balancesObject = req.body.balancesObject

    try{

        const response = await fetch('https://simple-brokerage-platfor-144bb-default-rtdb.firebaseio.com/Balances.json', {
        method:'PUT',
        headers:{
            'Content-Type':'application/json'
        },    
        body:JSON.stringify(balancesObject)})

        if(response.status !== 200){
            throw new Error('Unable to update total available funds.')
        }

        res.sendStatus(response.status)

    }catch(error){
        console.log(error)
    }
})

app.post('/orders', async (req, res) => {

    const order = req.body.order

    try{

        const response = await fetch('https://simple-brokerage-platfor-144bb-default-rtdb.firebaseio.com/Orders.json', {
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },    
        body:JSON.stringify(order)})

        if(response.status !== 200){
            throw new Error('Unable to update total available funds.')
        }

        res.sendStatus(response.status)

    }catch(error){
        console.log(error)
    }

})

app.get('/getOrders', async (req, res) => {

    const response = await fetch('https://simple-brokerage-platfor-144bb-default-rtdb.firebaseio.com/Orders.json')
    const dataObject = await response.json()

    res.send(dataObject)
})

// app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, '../client/front-end/build', 'index.html'));
// });

app.listen(3001, () => {
    console.log('Server running on port 3001')
})