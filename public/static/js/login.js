/**
 * 登录页面
 *
 * 1. 判断格式
 * 2. 发送数据
 * 3. 接受返回数据并进行跳转
 */

'use strict';

import { checkFormat } from './checkFormat.js';

const form = document.querySelector('form');
const submit = document.querySelector('#submit');

form.addEventListener('submit', (e) => {
    e.preventDefault();
});

submit.addEventListener('click', async () => {
    checkFormat()
        .then((result) => {
            if (result) {
                sendData();
            } else {
                console.log('检查失败');
                submit.classList.add('error');
                submit.textContent = '输入格式错误';
            }
        })
        .catch((err) => {
            console.log(err);
        });
});

const email = document.querySelector('#email');
const password = document.querySelector('#password');

email.addEventListener('input', clearTips);
password.addEventListener('input', clearTips);

function clearTips() {
    submit.classList.remove('error');
    submit.disabled = false;
    submit.textContent = 'Login';
}

async function sendData() {
    submit.textContent = 'Connecting';
    submit.disabled = true;

    const data = {
        email: email.value,
        password: password.value,
    };

    fetch('/login', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json',
        }),
    })
        .then((res) => res.json())
        .catch((err) => {
            console.log(err);
        })
        .then((response) => {
            console.log('返回结果', response);
            if (response.code === 100) {
                localStorage.setItem('token', response.token);
                submit.classList.remove('error');
                submit.textContent = '登录成功';
                window.location.href = '/';
            } else if (response.code === 101) {
                submit.classList.add('error');
                submit.textContent = '密码错误';
            } else if (response.code === 102) {
                submit.classList.add('error');
                submit.textContent = '账号不存在';
            } else {
                submit.classList.add('error');
                submit.textContent = '未知错误';
            }
        });
}
