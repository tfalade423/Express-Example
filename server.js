const express = require('express')
const serveIndex= require('serve-index')

 app = express()
 port = process.env.PORT || 4000;

app.use((req,res,next) =>{
    console.log('Time:', Date.now())
    next();
})

app.use('/request-type', (req,res, next) =>{
    console.log('request type', req.method);
    next();
})

app.use('/public', express.static('public'))
app.use('/public', serveIndex('public'))

app.get('/', (req,res) => {
    res.send('Welcome to my first Successful response on Node')
})

app.get('/login',(req, res) => {
    res.send('Welcome to login page')
})

app.listen(port, () =>console.log(`Example app is listening on: ${port}`))