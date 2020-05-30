/**
 * JWT 生成令牌
 * 有效时间 2 个小时
 */

'use strict';

const fs = require('fs');
const jwt = require('jsonwebtoken');

const keyPath = './data/jwt.key';
const key = fs.readFileSync(keyPath).toString();

module.exports = function (email) {
    const payload = {
        email: email,
    };
    return jwt.sign(payload, key, { expiresIn: '2h' });
};
