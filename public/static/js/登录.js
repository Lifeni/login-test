/**
 * 登录页面
 *
 * 1. 判断格式
 * 2. 发送数据
 * 3. 接受返回数据并进行跳转
 */

'use strict';

import { 检查 } from './格式检查.js';

const form = document.querySelector('form');
const submit = document.querySelector('#submit');

form.addEventListener('submit', (e) => {
    e.preventDefault();
});

submit.addEventListener('click', async () => {
    检查()
        .then((result) => {
            if (result) {
                发送数据();
            } else {
                console.log('检查失败');
                submit.classList.add('error');
                submit.innerText = '格式错误';
            }
        })
        .catch((err) => {
            console.log(err);
        });
});

const email = document.querySelector('#email');
const password = document.querySelector('#password');

email.addEventListener('input', 清除提示);
password.addEventListener('input', 清除提示);

function 清除提示() {
    submit.classList.remove('error');
    submit.disabled = false;
    submit.innerText = 'Login';
}

async function 发送数据() {
    submit.innerText = 'Connecting';
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
            if (response.code === '010') {
                if (response.token) {
                    localStorage.setItem('token', response.token);
                }
                submit.classList.remove('error');
                submit.innerText = response.message;
                window.location.href = '/home';
            } else {
                submit.classList.add('error');
                submit.innerText = response.message;
            }
        });
}
