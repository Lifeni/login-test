'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const open = require('open');
const app = express();

const port = 10010;

const 中间层 = require('./server/中间层');
const 检测令牌有效性 = require('./server/检测令牌有效性');

app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ extended: false }));

app.post('/login', (req, res) => {
    const data = {
        header: req.headers,
        data: req.body,
    };

    中间层.login(data).then((response) => {
        res.json(response);
    });
});

app.post('/register', (req, res) => {
    const data = {
        header: req.headers,
        data: req.body,
    };

    中间层.register(data).then((response) => {
        res.json(response);
    });
});

app.post('/token', (req, res) => {
    const data = req.body.token;

    检测令牌有效性(data).then((response) => {
        res.json({
            result: response,
        });
    });
});

app.listen(port, () => {
    const url = 'http://localhost:10010';
    console.log(`Test Page: ${url}`);
    // open(url)
});
