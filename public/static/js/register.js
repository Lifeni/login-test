/**
 * 注册页面
 *
 * 1. 生成和验证验证码
 * 2. 检查格式
 * 3. 发送数据到后端
 * 4. 接收返回的数据并跳转网页
 */

'use strict';

import { checkFormat } from './checkFormat.js';

document.addEventListener('DOMContentLoaded', () => {
    getCaptcha();
    submit.disabled = true;
});

const captchaText = document.querySelector('#captcha-text');
const captcha = document.querySelector('#captcha');

captchaText.addEventListener('click', getCaptcha);

function getCaptcha() {
    const num1 = Math.round(Math.random() * 20);
    const num2 = Math.round(Math.random() * 20);
    const answer = num1 + num2;

    captchaText.innerText = `${num1} + ${num2} = ?`;

    captcha.addEventListener('input', (e) => {
        submit.disabled = true;
        if (e.target.value === answer.toString()) {
            submit.disabled = false;
            captcha.disabled = true;
            captchaText.innerText = 'Verified';
            captchaText.removeEventListener('click', getCaptcha);
        }
    });
}

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
                submit.innerText = '输入格式错误';
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
    if (captchaText.innerText === 'Verified') {
        submit.disabled = false;
    } else {
        submit.disabled = true;
    }
    submit.innerText = 'Register';
}

async function sendData() {
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
            if (response.code === 110) {
                localStorage.setItem('token', response.token);
                submit.classList.remove('error');
                submit.innerText = '注册成功';
                window.location.href = '/';
            } else if (response.code === 111) {
                submit.classList.add('error');
                submit.innerText = '账号已被注册';
            } else {
                submit.classList.add('error');
                submit.innerText = '未知错误';
            }
        });
}
