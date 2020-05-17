/**
 * JWT 生成令牌
 *
 * @param string
 * @returns string
 */

'use strict';

const fs = require('fs');
const jwt = require('jsonwebtoken');

const keyPath = './data/jwt.key';
const key = fs.readFileSync(keyPath).toString();

module.exports = function (email) {
    const payload = { email: email };
    return jwt.sign(payload, key, { expiresIn: '1h' });
};
