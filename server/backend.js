const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const path = './data/db.json'
const port = 10011

const db = JSON.parse(fs.readFileSync(path).toString())

app.use(bodyParser.json({ extended: false }))

app.post('/', (req, res) => {
    const email = req.body.email
    const password = req.body.password

    for (const i of db) {
        if (i.email === email) {
            if (i.password === password) {
                res.json({
                    code: '0'
                })
            } else {
                res.json({
                    code: '2',
                    message: '密码错误'
                })
            }
        } else {
            res.json({
                code: '1',
                message: '账号不存在'
            })
        }
    }
})

app.listen(port, () => {
    console.log(`Backend: ${port}`)
})