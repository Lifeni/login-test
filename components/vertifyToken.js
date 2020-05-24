/**
 * JWT 检测令牌是否有效
 *
 * @param string
 * @returns void
 */

'use strict';

const fs = require('fs');
const axios = require('axios').default;
const jwt = require('jsonwebtoken');

const backend = 'http://localhost:10011';

const keyPath = './data/jwt.key';
const key = fs.readFileSync(keyPath).toString();

async function changeGroup(uid) {
    let re = false;
    let result
    await axios
        .put(`${backend}/group`, {
            uid: uid,
            group: 1,
        })
        .then((response) => {
            result = response.data;
            console.log(result);

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
        console.log('body', body);

        result = true;
        if (body.type && body.type === 'email') {
            if (!changeGroup(body.uid)) {
                result = false;
            }
        }
    } catch (err) {
        result = false;
    }
    return result;
};
