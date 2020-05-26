/**
 * 模拟后端读写数据库的操作
 *
 * 1. 数据查重并存入数据库
 * 2. 检测账号密码是否正确
 *
 * @host http://localhost:10011
 */

'use strict';

const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const port = 10011;

const dbPath = './data/db.json';

app.use(bodyParser.json({ extended: false }));

app.post('/login', (req, res) => {
    const db = JSON.parse(fs.readFileSync(dbPath).toString());
    const email = req.body.email;
    const password = req.body.password;
    let isExist = 0;
    for (const i of db) {
        if (i.email === email) {
            isExist = 1;
            if (i.password === password) {
                res.json({
                    code: 100,
                    uid: i.uid,
                });
            } else {
                res.json({ code: 101 });
            }
            break;
        }
    }

    if (!isExist) {
        res.json({ code: 102 });
    }
});

app.post('/register', (req, res) => {
    const db = JSON.parse(fs.readFileSync(dbPath).toString());
    const email = req.body.email;
    const password = req.body.password;

    let isExist = 0;
    for (const i of db) {
        if (i.email === email) {
            isExist = 1;
            res.json({ code: 111 });
            break;
        }
    }

    if (!isExist) {
        let newDB = db;
        const uid = new Date().getTime().toString();
        newDB.push({
            uid: uid,
            email: email,
            password: password,
            name: '',
            description: '',
            avatar: '',
            group: 0,
        });
        fs.writeFileSync(dbPath, JSON.stringify(newDB));
        res.json({
            code: 110,
            uid: uid,
        });
    }
});

app.put('/group', (req, res) => {
    const db = JSON.parse(fs.readFileSync(dbPath).toString());
    const uid = req.body.uid;
    const group = req.body.group;

    let isExist = 0;
    for (const i of db) {
        if (i.uid === uid) {
            isExist = 1;
            if (i.group === group) {
                res.json({ code: 521 });
            } else {
                let newData = i;
                newData.group = group;
                db.pop(i);
                let newDB = db;
                newDB.push(newData);
                fs.writeFileSync(dbPath, JSON.stringify(newDB));
                //i.group = group;
                //let newDB = db;
                //fs.writeFileSync(dbPath, JSON.stringify(newDB));
                res.json({ code: 520 });
            }
            break;
        }
    }

    if (!isExist) {
        res.json({ code: 522 });
    }
});

app.get('/profile', (req, res) => {
    const db = JSON.parse(fs.readFileSync(dbPath).toString());
    const uid = req.query.uid;

    let isExist = 0;
    for (const i of db) {
        if (i.uid === uid) {
            isExist = 1;
            const data = i;
            delete data.password;
            res.json({
                code: 300,
                data: data,
            });
            break;
        }
    }

    if (!isExist) {
        res.json({ code: 301 });
    }
});

app.put('/password', (req, res) => {
    const db = JSON.parse(fs.readFileSync(dbPath).toString());
    const uid = req.body.uid;
    const oldPassword = req.body['old-password'];
    const newPassword = req.body['new-password'];

    let isExist = 0;
    for (const i of db) {
        if (i.uid === uid) {
            isExist = 1;
            if (i.password === oldPassword) {
                let newData = i;
                newData.password = newPassword;
                db.pop(i);
                let newDB = db;
                newDB.push(newData);
                fs.writeFileSync(dbPath, JSON.stringify(newDB));
                res.json({ code: 120 });
            } else {
                res.json({ code: 121 });
            }
            break;
        }
    }

    if (!isExist) {
        res.json({ code: 122 });
    }
});

app.put('/profile', (req, res) => {
    const db = JSON.parse(fs.readFileSync(dbPath).toString());
    const uid = req.body.uid;

    let isExist = 0;
    for (const i of db) {
        if (i.uid === uid) {
            isExist = 1;
            let newData = i;
            if (req.body.name) {
                newData.name = req.body.name;
            }
            if (req.body.description) {
                newData.description = req.body.description;
            }
            db.pop(i);
            let newDB = db;
            newDB.push(newData);
            fs.writeFileSync(dbPath, JSON.stringify(newDB));
            res.json({ code: 320 });
            break;
        }
    }

    if (!isExist) {
        res.json({ code: 321 });
    }
});

app.delete('/account', (req, res) => {
    res.json({ code: 130 });
});

app.post('/avatar', (req, res) => {
    const db = JSON.parse(fs.readFileSync(dbPath).toString());
    const uid = req.body.uid;

    let isExist = 0;
    for (const i of db) {
        if (i.uid === uid) {
            isExist = 1;
            let newData = i;
            newData.avatar = req.body.avatar;
            db.pop(i);
            let newDB = db;
            newDB.push(newData);
            fs.writeFileSync(dbPath, JSON.stringify(newDB));
            res.json({ code: 620 });
            break;
        }
    }

    if (!isExist) {
        res.json({ code: 621 });
    }
});

app.listen(port, () => {
    console.log(`Backend: ${port}`);
});
