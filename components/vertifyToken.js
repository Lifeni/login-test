/**
 * JWT 检测令牌是否有效
 */

'use strict';

const fs = require('fs');
const axios = require('axios').default;
const jwt = require('jsonwebtoken');

const backend = 'http://localhost:8080/GroupWork';

const keyPath = './data/jwt.key';
const key = fs.readFileSync(keyPath).toString();

async function changeGroup(email) {
    let re = false;
    let result;
    await axios
        .get(`${backend}/UpdatePerson_GroupidServlet`, {
            params: {
                email: email,
                groupid: true,
            },
        })
        .then((response) => {
            result = response.data;
            if (result.code === '520') {
                re = true;
            } else if (result.code === '521') {
                re = false;
            } else {
                re = false;
            }
        })
        .catch((err) => {
            console.log(err);
        });
    return re;
}

module.exports = async function (token) {
    let result = false;
    try {
        const body = jwt.verify(token, key);
        result = true;
        if (body.type && body.type === 'email') {
            if (!changeGroup(body.email)) {
                result = false;
            }
        }
    } catch (err) {
        result = false;
    }
    return result;
};
