/**
 * Node 入口文件
 * 使用 Express 进行路由管理
 */

'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');

const app = express();
const upload = multer();

const port = 10010;

const vertifyToken = require('./components/vertifyToken');
const forwardRequest = require('./components/forwardRequest');
const sendEmail = require('./components/sendEmail');
const uploadAvatar = require('./components/uploadAvatar.js');

const jwt = require('jsonwebtoken');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ extended: false }));

app.get('/', (req, res) => {
    if (req.query.token && vertifyToken(req.query.token)) {
        res.sendFile(`${__dirname}/public/userPage.html`);
    } else {
        res.sendFile(`${__dirname}/public/visitorPage.html`);
    }
});

app.use(express.static('./public'));

app.get('/profile', (req, res) => {
    if (req.query.token && vertifyToken(req.query.token)) {
        forwardRequest
            .profile('GET', jwt.decode(req.query.token).email)
            .then((response) => response.data)
            .then((response) => {
                response.data = response.person;
                res.json(response);
            });
    } else {
        res.json({
            code: 302,
        });
    }
});

app.put('/profile', (req, res) => {
    if (req.body.token && vertifyToken(req.body.token)) {
        const data = {
            email: jwt.decode(req.body.token).email,
            name: req.body.name,
            description: req.body.description,
        };
        forwardRequest
            .profile('POST', data)
            .then((response) => response.data)
            .then((response) => {
                res.json(response);
            });
    } else {
        res.json({
            code: 322,
        });
    }
});

app.put('/password', (req, res) => {
    if (req.body.token && vertifyToken(req.body.token)) {
        const data = {
            email: jwt.decode(req.body.token).email,
            'old-password': req.body['old-password'],
            'new-password': req.body['new-password'],
        };
        forwardRequest
            .password(data)
            .then((response) => response.data)
            .then((response) => {
                res.json(response);
            });
    } else {
        res.json({
            code: 124,
        });
    }
});

app.delete('/account', (req, res) => {
    if (req.body.token && vertifyToken(req.body.token)) {
        const data = {
            email: jwt.decode(req.body.token).email,
        };
        forwardRequest
            .account(data)
            .then((response) => response.data)
            .then((response) => {
                res.json(response);
            });
    } else {
        res.json({
            code: 132,
        });
    }
});

app.post('/register', (req, res) => {
    forwardRequest.register(req.body).then((response) => {
        res.json(response);
    });
});

app.post('/login', (req, res) => {
    forwardRequest.login(req.body).then((response) => {
        res.json(response);
    });
});

app.post('/token', (req, res) => {
    vertifyToken(req.body.token).then((result) => {
        if (result) {
            res.json({ code: 240 });
        } else {
            res.json({ code: 241 });
        }
    });
});

app.post('/email', (req, res) => {
    vertifyToken(req.body.token).then((result) => {
        if (result) {
            sendEmail(req.body.email).then((result2) => {
                if (result2) {
                    res.json({ code: 440 });
                } else {
                    res.json({ code: 441 });
                }
            });
        } else {
            res.json({ code: 241 });
        }
    });
});

app.post('/avatar', upload.single('image'), (req, res) => {
    vertifyToken(req.body.token).then((result) => {
        if (
            result &&
            uploadAvatar(jwt.decode(req.body.token).email, req.file)
        ) {
            res.json({ code: 610 });
        } else {
            res.json({ code: 611 });
        }
    });
});

app.listen(port, () => {
    const url = 'http://localhost:10010';
    console.log(`Test Page: ${url}`);
});
