/**
 * 中间层负责转发数据到后端
 * 登录和注册部分还负责把密码进行加密
 */

'use strict';

const fs = require('fs');
const axios = require('axios').default;
const path = require('path');

const keyPath = './data/jwt.key';
const key = fs.readFileSync(keyPath).toString();

const crytpo = require('crypto');
const jwt = require('jsonwebtoken');

const backend = 'http://localhost:8080/GroupWork';
const root = path.resolve(__dirname, '..');

const generateToken = require('./generateToken');
const vertifyToken = require('./vertifyToken');

async function login(data) {
    const hmac = crytpo.createHmac('md5', key);
    return axios
        .get(`${backend}/LogPersonServlet`, {
            params: {
                email: data.email,
                password: hmac.update(data.password).digest('base64'),
            },
        })
        .then((response) => response.data)
        .then((response) => {
            if (Number(response.code) === 100) {
                response.token = generateToken(data.email);
            }
            return response;
        })
        .catch((err) => {
            console.log(err);
        });
}

async function register(data) {
    const hmac = crytpo.createHmac('md5', key);

    return axios
        .get(`${backend}/RigistePersonServlet`, {
            params: {
                email: data.email,
                password: hmac.update(data.password).digest('base64'),
            },
        })
        .then((response) => response.data)
        .then((response) => {
            if (Number(response.code) === 110) {
                response.token = generateToken(data.email);
            }
            return response;
        })
        .catch((err) => {
            console.log(err);
        });
}

async function profile(method, data) {
    if (method === 'GET') {
        return axios
            .get(`${backend}/DoQueryServlet`, {
                params: {
                    email: data,
                },
            })
            .catch((err) => {
                console.log(err);
            });
    } else if ((method = 'POST')) {
        return axios
            .get(`${backend}/UpdatePerson_DescriptionServlet`, {
                params: {
                    email: data.email,
                    name: data.name,
                    description: data.description,
                },
            })
            .catch((err) => {
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
    return axios
        .get(`${backend}/UpdatePerson_PasswordServlet`, {
            params: {
                email: data.email,
                oldpassword: data['old-password'],
                newpassword: data['new-password'],
            },
        })
        .catch((err) => {
            console.log(err);
        });
}

async function account(data) {
    return axios
        .get(`${backend}/DeletePersonServlet`, {
            params: {
                email: data.email,
            },
        })
        .catch((err) => {
            console.log(err);
        });
}

module.exports = {
    login: login,
    register: register,
    profile: profile,
    password: password,
    account: account,
};
