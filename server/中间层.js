/**
 * 中间层负责转发数据
 */

'use strict';

const fs = require('fs');
const axios = require('axios').default;
const path = require('path');

const keyPath = './data/jwt.key';
const key = fs.readFileSync(keyPath).toString();

const crytpo = require('crypto');

const backend = 'http://localhost:10011';
const root = path.resolve(__dirname, '..');

const 生成令牌 = require('./生成令牌');
const 检测令牌有效性 = require('./检测令牌有效性');

async function login(data) {
    return await send(data, `${backend}/read`);
}

async function register(data) {
    return await send(data, `${backend}/create`);
}

async function send(data, url) {
    const hmac = crytpo.createHmac('md5', key);
    const email = data.data.email;
    const password = hmac.update(data.data.password).digest('base64');
    let result = {};
    await axios
        .post(url, {
            email: email,
            password: password,
        })
        .then((response) => {
            result = response.data;
            if (result.code === '00') {
                result.message = '未找到账号';
            } else if (result.code === '010') {
                result.message = '登录成功';
                result.token = 生成令牌(email);
            } else if (result.code === '011') {
                result.message = '密码错误';
            } else if (result.code === '10') {
                result.message = '注册成功';
                result.token = 生成令牌(email);
            } else if (result.code === '11') {
                result.message = '账号已存在';
            }
        })
        .catch((err) => {
            console.log(err);
        });
    return result;
}

module.exports = {
    login: login,
    register: register,
};
