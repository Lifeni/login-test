/**
 * JWT 生成令牌
 *
 * @param string
 * @return string
 */

'use strict';

const fs = require('fs');
const jwt = require('jsonwebtoken');

const keyPath = './data/jwt.key';
const key = fs.readFileSync(keyPath).toString();

module.exports = function (uid) {
    const payload = { uid: uid };
    return jwt.sign(payload, key, { expiresIn: '1h' });
};
