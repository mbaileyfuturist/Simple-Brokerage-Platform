const express = require('express')
const app = express()
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

app.use(express.json())
app.use(cors())

app.post('/signup', async (req, res) => {
        
    try{

        const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCuhTlBQwUzLibIhgEQ75--o92q3_zDB_g',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            email:req.body.email,
            password:req.body.password,
            returnSecureToken:req.body.returnSecureToken
            })
        } )

        const data = await response.json()

        if(response.status !== 200){
            throw new Error('Failed to sign up user.')
        }

        res.send(data)

    }catch(error){
        console.log(error)
    }

})

app.post('/login', async (req, res) => {
    
    const email = req.body.email
    const password = req.body.password
    const returnSecureToken = req.body.returnSecureToken

   try{

    const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCuhTlBQwUzLibIhgEQ75--o92q3_zDB_g', {
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            email:email,
            password:password,
            returnSecureToken: returnSecureToken
        })
    })

    const data = await response.json()

    if(response.status !== 200){
        throw new Error('Failed to authenticate user.')
    }
    
    res.send(data)

   }catch(error){
       console.log(error)
   }

})

app.post('/addUser', async (req, res) => {

    const idToken = req.body.idToken


    try{
        const response = await fetch('https://simple-brokerage-platfor-144bb-default-rtdb.firebaseio.com/Users.json?auth=' + idToken, {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                firstName:req.body.firstName,
                lastName:req.body.lastName,
                email:req.body.email,
                userName:req.body.userName,
                password:req.body.password,
                id:1,
                balances:{
                    totalAvailableFunds:0,
                    totalAssets:0,
                    totalHoldings:0
                },
                orders:1,
                uploadProfilePicture:1,
                address:req.body.address,
                city:req.body.city,
                state:req.body.state,
                age:req.body.age
            })
        })

    res.sendStatus(response.status)
    }catch(error){
        console.log(error)
    }
})

app.post('/getUser', async (req, res) => {
        
    const userId = req.body.id

    try{

        const response = await fetch('https://simple-brokerage-platfor-144bb-default-rtdb.firebaseio.com/Users/' + userId + '.json')
        const data = await response.json()

        if(response.status !== 200){
            throw new Error('Failed to get user')
        }

        res.send(data)

    }catch(error){
        console.log(error)
    }
})

app.post('/getUsers', async (req, res) => {

    const idToken = req.body.idToken

   try{
        const response = await fetch('https://simple-brokerage-platfor-144bb-default-rtdb.firebaseio.com/Users.json?auth=' + idToken)
        const data = await response.json()

        if(response.status !== 200){
            throw new Error('Failed to fetch users.')
        }
        res.send(data)
   }catch(error){
       console.log(error)
   }
})

app.post('/Balances', async (req, res) => {

    const id = req.body.id
    const idToken = req.body.idToken

    try{

            const response = await fetch('https://simple-brokerage-platfor-144bb-default-rtdb.firebaseio.com/Users/' + id + '/balances.json?auth=' + idToken)
            const dataObject = await response.json()

            if(response.status !== 200){
                throw new Error('Failed to fetch balances.')
            }

            res.send(dataObject)

    }catch(error){
        console.log(error)
    }
})

app.post('/totalAvailableFunds', async (req, res) => {

    const totalAvailableFunds = req.body.totalAvailableFunds
    const id = req.body.id
    const idToken = req.body.idToken

    try{

        const response = await fetch('https://simple-brokerage-platfor-144bb-default-rtdb.firebaseio.com/Users/' + id + '/balances/totalAvailableFunds.json?auth=' + idToken, {
        method:'PUT',
        headers:{
            'Content-Type':'application/json'
        },    
        body:JSON.stringify(totalAvailableFunds)
        })

        if(response.status !== 200){
            throw new Error('Unable to update total available funds.')
        }

        res.sendStatus(response.status)

    }catch(error){
        console.log(error)
    }
})

app.post('/updateUser', async (req, res) => {

    const id = req.body.id
    const idToken = req.body.idToken

    try{
        const response = await fetch('https://simple-brokerage-platfor-144bb-default-rtdb.firebaseio.com/Users/' + id + '/id.json?auth=' + idToken, {
        method:'PUT',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(id)
        })

        res.sendStatus(response.status)
    }catch(error){
        console.log(error)
    }
})

app.post('/totalAssets', async (req, res) => {

    const totalAssets = req.body.totalAssets
    const id = req.body.id
    const idToken = req.body.idToken

    try{

        const response = await fetch('https://simple-brokerage-platfor-144bb-default-rtdb.firebaseio.com/Users/' + id + '/balances/totalAssets.json?auth=' + idToken, {
        method:'PUT',
        headers:{
            'Content-Type':'application/json'
        },    
        body:JSON.stringify(totalAssets)
        })

        if(response.status !== 200){
            throw new Error('Unable to update total Assets.')
        }

        res.sendStatus(response.status)

    }catch(error){
        console.log(error)
    }
})

app.post('/updateBalances', async (req, res) => {

    const balancesObject = req.body.balancesObject
    const id = req.body.id
    const idToken = req.body.idToken

    try{

        const response = await fetch('https://simple-brokerage-platfor-144bb-default-rtdb.firebaseio.com/Users/' + id + '/balances.json?auth=' + idToken, {
        method:'PUT',
        headers:{
            'Content-Type':'application/json'
        },    
        body:JSON.stringify(balancesObject)})

        if(response.status !== 200){
            throw new Error('Unable to update Balances.')
        }

        res.sendStatus(response.status)

    }catch(error){
        console.log(error)
    }
})

app.post('/orders', async (req, res) => {

    const order = req.body.order
    const id = req.body.id
    const idToken = req.body.idToken

    try{

        const response = await fetch('https://simple-brokerage-platfor-144bb-default-rtdb.firebaseio.com/Users/' + id + '/orders.json?auth=' + idToken, {
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },    
        body:JSON.stringify(order)})

        if(response.status !== 200){
            throw new Error('Unable to add new order.')
        }

        res.sendStatus(response.status)

    }catch(error){
        console.log(error)
    }

})

app.post('/getOrders', async (req, res) => {

    const id = req.body.id
    const idToken = req.body.idToken

    const response = await fetch('https://simple-brokerage-platfor-144bb-default-rtdb.firebaseio.com/Users/' + id + '/orders.json?auth=' + idToken)
    const dataObject = await response.json()

    res.send(dataObject)
})

app.listen(3001, () => {
    console.log('Server running on port 3001')
})