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
const jwt = require('jsonwebtoken');

const backend = 'http://localhost:10011';
const root = path.resolve(__dirname, '..');

const generateToken = require('./generateToken');
const vertifyToken = require('./vertifyToken');

async function login(data) {
    const hmac = crytpo.createHmac('md5', key);
    data.password = hmac.update(data.password).digest('base64');
    return axios
        .post(`${backend}/login`, data)
        .then((response) => response.data)
        .then((response) => {
            if (response.code === 100) {
                response.token = generateToken(response.uid);
            }
            return response;
        })
        .catch((err) => {
            console.log(err);
        });
}

async function register(data) {
    const hmac = crytpo.createHmac('md5', key);
    data.password = hmac.update(data.password).digest('base64');
    return axios
        .post(`${backend}/register`, data)
        .then((response) => response.data)
        .then((response) => {
            if (response.code === 110) {
                response.token = generateToken(response.uid);
            }
            return response;
        })
        .catch((err) => {
            console.log(err);
        });
}

async function profile(method, data) {
    if (method === 'GET') {
        return axios.get(`${backend}/profile?uid=${data}`).catch((err) => {
            console.log(err);
        });
    } else if ((method = 'PUT')) {
        return axios.put(`${backend}/profile`, data).catch((err) => {
            console.log(err);
        });
    }
}

async function password(data) {
    data['old-password'] = crytpo
        .createHmac('md5', key)
        .update(data['old-password'])
        .digest('base64');
    data['new-password'] = crytpo
        .createHmac('md5', key)
        .update(data['new-password'])
        .digest('base64');
    return axios.put(`${backend}/password`, data).catch((err) => {
        console.log(err);
    });
}

async function account(data) {
    return axios.delete(`${backend}/account`, data).catch((err) => {
        console.log(err);
    });
}

async function avatar(data) {
    return axios.post(`${backend}/avatar`, data).catch((err) => {
        console.log(err);
    });
}

module.exports = {
    login: login,
    register: register,
    profile: profile,
    password: password,
    account: account,
    avatar: avatar,
};
