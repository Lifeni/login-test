/**
 * 模拟后端读写数据库的操作
 *
 * 1. 数据查重并存入数据库
 * 2. 检测账号密码是否正确
 *
 * @host http://localhost:10011
 *
 * @interface READ
 * @returns { 'code': '00' } 数据库内无匹配
 * @returns { 'code': '010' } 数据库内有匹配，且匹配正确
 * @returns { 'code': '011' } 数据库内有匹配，且匹配不正确
 *
 * @interface CREATE
 * @returns { 'code': '10' } 可以存入数据
 * @returns { 'code': '11' } 数据已存在，无法存入
 *
 * @interface UPDATE
 * @returns { 'code': '20' } 数据不存在
 * @returns { 'code': '210' } 数据可以修改
 * @returns { 'code': '211' } 数据已经修改过了
 *
 * @interface GET 获取用户信息
 */

'use strict';

const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const port = 10011;

const dbPath = './data/db.json';

app.use(bodyParser.json({ extended: false }));

app.post('/read', (req, res) => {
    const db = JSON.parse(fs.readFileSync(dbPath).toString());
    const email = req.body.email;
    const password = req.body.password;

    console.log(email, password);

    let isExist = 0;
    for (const i of db) {
        console.log(i);

        if (i.email === email) {
            isExist = 1;
            if (i.password === password) {
                res.json({ code: '010' });
                console.log(1);
            } else {
                res.json({ code: '011' });
                console.log(2);
            }
            break;
        }
    }

    if (!isExist) {
        res.json({ code: '00' });
    }
});

app.post('/create', (req, res) => {
    const db = JSON.parse(fs.readFileSync(dbPath).toString());
    const email = req.body.email;
    const password = req.body.password;

    let isExist = 0;
    for (const i of db) {
        if (i.email === email) {
            isExist = 1;
            res.json({ code: '11' });
            break;
        }
    }

    if (!isExist) {
        let newDB = db;
        console.log(newDB);

        newDB.push({
            id: new Date().getTime(),
            email: email,
            password: password,
            verified: false,
        });
        fs.writeFileSync(dbPath, JSON.stringify(newDB));
        res.json({ code: '10' });
    }
});

app.post('/update', (req, res) => {
    const db = JSON.parse(fs.readFileSync(dbPath).toString());
    const email = req.body.email;
    const check = req.body.check;

    let isExist = 0;
    for (const i of db) {
        if (i.email === email) {
            console.log(email);

            isExist = 1;
            if (i.verified === check) {
                res.json({ code: '211' });
            } else {
                console.log(i);

                i.verified = true;
                let newDB = db;
                fs.writeFileSync(dbPath, JSON.stringify(newDB));
                res.json({ code: '210' });
            }
            break;
        }
    }

    if (!isExist) {
        res.json({ code: '20' });
    }
});

app.get('/get', (req, res) => {
    const db = JSON.parse(fs.readFileSync(dbPath).toString());
    const email = req.query.email;
    console.log(req.query);

    let isExist = 0;
    for (const i of db) {
        if (i.email === email) {
            isExist = 1;
            const data = i;
            delete data.password;
            res.json(data);
            break;
        }
    }

    if (!isExist) {
        res.json({});
    }
});

app.listen(port, () => {
    console.log(`Backend: ${port}`);
});
