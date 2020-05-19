'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const open = require('open');
const app = express();

const port = 10010;

const 中间层 = require('./server/中间层');
const 检测令牌有效性 = require('./server/检测令牌有效性');
const 发送邮箱验证 = require('./server/发送邮箱验证');
const { response } = require('express');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ extended: false }));

app.get('/', (req, res) => {
    // console.log(req);
    if (req.query.token && 检测令牌有效性(req.query.token)) {
        res.sendFile(`${__dirname}/public/home.html`);
    } else {
        res.sendFile(`${__dirname}/public/index.html`);
    }
});

app.get('/info', (req, res) => {
    // console.log(req);
    if (req.query.token && 检测令牌有效性(req.query.token)) {
        中间层.info(req.query.token).then((response) => {
            res.json({
                code: 0,
                data: response,
            });
        });
    } else {
        res.json({
            code: 1,
        });
    }
});

app.use(express.static('./public'));

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
        console.log('/token res', response);

        res.json({
            result: response,
        });
    });
});

app.post('/email', (req, res) => {
    const data = req.body.token;
    检测令牌有效性(data).then((response) => {
        if (response) {
            res.json({
                result: 发送邮箱验证(req.body.email),
            });
        } else {
            res.json({
                result: response,
            });
        }
    });
});

app.listen(port, () => {
    const url = 'http://localhost:10010';
    console.log(`Test Page: ${url}`);
    // open(url)
});
