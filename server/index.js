const express = require('express')
const app = express()
const cors = require('cors');
const path = require('path')

// const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

app.use(express.json())
app.use(cors())

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/front-end/build', 'index.html'));
});

app.listen(3001, () => {
    console.log('Server running on port 3001')
})