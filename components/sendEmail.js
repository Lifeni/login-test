/**
 * 使用 阿里云 的邮件服务发送验证邮件
 *
 * 1. 生成 Token
 * 2. 发送邮件
 *
 * @param string
 * @return bool
 */

'use strict';

const fs = require('fs');
const jwt = require('jsonwebtoken');

const jwtKeyPath = './data/jwt.key';
const jwtKey = fs.readFileSync(jwtKeyPath).toString();

const accessKeyPath = './data/access-key.json';
const accessKey = JSON.parse(fs.readFileSync(accessKeyPath).toString());

const Core = require('@alicloud/pop-core');
const host = 'http://139.9.138.39:10010/';

async function sendEmail(payload, email) {
    var client = new Core({
        accessKeyId: accessKey.id,
        accessKeySecret: accessKey.secret,
        endpoint: 'https://dm.aliyuncs.com',
        apiVersion: '2015-11-23',
    });

    var params = {
        RegionId: 'cn-hangzhou',
        AccountName: 'test@mail.lifeni.life',
        AddressType: 1,
        ReplyToAddress: true,
        ToAddress: email,
        Subject: 'Test 邮箱验证',
        TextBody: `验证链接：${host}email/?token=${jwt.sign(payload, jwtKey, {
            expiresIn: '1h',
        })}，一小时内有效。`,
    };

    var requestOption = {
        method: 'POST',
    };

    client.request('SingleSendMail', params, requestOption).then(
        (result) => {
            console.log(JSON.stringify(result));
        },
        (ex) => {
            console.log(ex);
        }
    );
}

module.exports = async function (email, uid) {
    const payload = {
        email: email,
        type: 'email',
        uid: uid,
    };
    try {
        sendEmail(payload, email);
    } catch (err) {
        return false;
    }
    return true;
};
