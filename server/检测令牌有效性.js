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

async function 邮箱验证结果(email, result) {
    let re = false;
    await axios
        .post(`${backend}/update`, {
            email: email,
            check: result,
        })
        .then((response) => {
            result = response.data;
            console.log(result);

            if (result.code === '20') {
                re = false;
            } else if (result.code === '210') {
                console.log(210);

                re = true;
            } else if (result.code === '211') {
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
        if (body.check && !(await 邮箱验证结果(body.email, true))) {
            console.log(body.check, 'false');

            result = false;
        }
    } catch (err) {
        result = false;
    }
    return result;
};
