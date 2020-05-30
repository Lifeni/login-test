/**
 * 使用 阿里云 的 OOS 上传照片
 * 之后把图片地址发给后端
 */

'use strict';

const fs = require('fs');
const axios = require('axios').default;

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

const OSS = require('ali-oss');

const backend = 'http://localhost:8080/GroupWork';

module.exports = async function (email, file) {
    var client = new OSS({
        accessKeyId: accessKey.id,
        accessKeySecret: accessKey.secret,
        bucket: 'login-test',
        region: 'oss-cn-beijing',
        endpoint: 'https://oss-cn-beijing.aliyuncs.com',
        apiVersion: '2015-11-23',
    });
    try {
        const fileName = `avatar_${email}.${file.mimetype.split('/')[1]}`;
        let result = await client.put(fileName, new Buffer(file.buffer));
        console.log('图片上传情况：', result);
        await axios
            .get(`${backend}/UpdatePerson_AvatarServlet`, {
                params: {
                    email: email,
                    avatar: result.url,
                },
            })
            .then((response) => {
                console.log('后端图片存入情况：', response.code);
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
