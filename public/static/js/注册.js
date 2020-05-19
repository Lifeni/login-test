/**
 * 注册页面
 *
 * 1. 生成和验证验证码
 * 2. 检查格式
 * 3. 发送数据到后端
 * 4. 接收返回的数据并跳转网页
 */

'use strict';

import { 检查 } from './格式检查.js';

document.addEventListener('DOMContentLoaded', () => {
    生成验证码();
    submit.disabled = true;
});

const captchaText = document.querySelector('#captcha-text');
const captcha = document.querySelector('#captcha');

captchaText.addEventListener('click', 生成验证码);

function 生成验证码() {
    const num1 = Math.round(Math.random() * 20);
    const num2 = Math.round(Math.random() * 20);
    const answer = num1 + num2;

    captchaText.innerText = `${num1} + ${num2} = ?`;

    captcha.addEventListener('input', (e) => {
        if (e.target.value === answer.toString()) {
            submit.disabled = false;
            captcha.disabled = true;
            captchaText.innerText = 'Verified';
            captchaText.removeEventListener('click', 生成验证码);
        }
    });
}

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
    submit.innerText = 'Register';
}

async function 发送数据() {
    submit.innerText = 'Connecting';
    submit.disabled = true;

    const data = {
        email: email.value,
        password: password.value,
    };

    fetch('/register', {
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
            if (response.code === '10') {
                if (response.token) {
                    localStorage.setItem('token', response.token);
                }
                submit.classList.remove('error');
                submit.innerText = response.message;
                window.location.href = '/';
            } else {
                submit.classList.add('error');
                submit.innerText = response.message;
            }
        });
}
