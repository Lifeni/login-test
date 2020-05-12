'use strict';

const express = require('express')
const bodyParser = require('body-parser')
const open = require('open')
const app = express()
const port = 10010

const login = require('./server/login')
const register = require('./server/register')
const backend = require('./server/backend')

app.use(express.static('./public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({ extended: false }))

app.post('/login', (req, res) => {
    const data = {
        header: req.headers,
        data: req.body,
    }
    login(data).then((response) => {
        res.json(response)
    })
})

app.post('/register', (req, res) => {
    const data = {
        header: req.headers,
        data: req.body,
    }
    res.json({
        code: '0',
        token: 'gfdjnh563'
    })
})

app.listen(port, () => {
    const url = 'http://localhost:10010'
    console.log(`Test Page: ${url}`)
    // open(url)
})