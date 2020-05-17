/**
 * JWT 检测令牌是否有效
 *
 * @param string
 * @returns void
 */

'use strict';

const fs = require('fs');
const jwt = require('jsonwebtoken');

const keyPath = './data/jwt.key';
const key = fs.readFileSync(keyPath).toString();

module.exports = async function (token) {
    let result = false;
    try {
        jwt.verify(token, key);
        result = true;
    } catch (err) {
        result = false;
    }
    return result;
};
