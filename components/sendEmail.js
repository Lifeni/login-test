/**
 * 使用 阿里云 的邮件服务
 * 生成 Token 并发送验证邮件
 */

'use strict';

const fs = require('fs');
const jwt = require('jsonwebtoken');

const jwtKeyPath = './data/jwt.key';
const jwtKey = fs.readFileSync(jwtKeyPath).toString();

let accessKeyPath;
let accessKey;

try {
    accessKeyPath = './data/access-key.json';
    accessKey = JSON.parse(fs.readFileSync(accessKeyPath).toString());
} catch (error) {
    console.log(
        '请把阿里云的 AccessKey 填入 /data/access-key.json，然后修改本文件中的相关信息。',
        error
    );
}

const Core = require('@alicloud/pop-core');
const host = 'https://test.lifeni.life/';

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

    return client.request('SingleSendMail', params, requestOption).then(
        (result) => {
            console.log('邮件发送情况：', JSON.stringify(result));
            return true;
        },
        (ex) => {
            console.log(ex);
            return false;
        }
    );
}

module.exports = async function (email) {
    const payload = {
        email: email,
        type: 'email',
    };

    return sendEmail(payload, email);
};
