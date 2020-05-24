/**
 * 使用 阿里云 的 OOS 上传照片
 *
 * 1. 生成 Token
 * 2. 发送邮件
 *
 * @param string
 * @return string
 */

'use strict';

const fs = require('fs');
const axios = require('axios').default;

const accessKeyPath = './data/access-key.json';
const accessKey = JSON.parse(fs.readFileSync(accessKeyPath).toString());

const OSS = require('ali-oss');

const backend = 'http://localhost:10011';

module.exports = async function (uid, file) {
    console.log(uid, 0);
    var client = new OSS({
        accessKeyId: accessKey.id,
        accessKeySecret: accessKey.secret,
        bucket: 'login-test',
        region: 'oss-cn-beijing',
        endpoint: 'https://oss-cn-beijing.aliyuncs.com',
        apiVersion: '2015-11-23',
    });
    try {
        console.log(uid, 1);
        const fileName = `avatar_${uid}.${file.mimetype.split('/')[1]}`;
        let result = await client.put(fileName, new Buffer(file.buffer));
        console.log(result);
        await axios
            .post(`${backend}/avatar`, {
                uid: uid,
                avatar: result.url,
            })
            .then((response) => {
                console.log(response.code);
            })
            .catch((err) => {
                console.log(err);
            });
    } catch (e) {
        console.log(e);
        return false;
    }
    return true;
};
