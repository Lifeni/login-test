const express = require('express')
const open = require('open')
const app = express()
const port = 10010

app.use(express.static('./public'))

app.listen(port, () => {
    const url = 'http://localhost:10010'
    console.log(`Test Page: ${url}`)
    open(url)
})
