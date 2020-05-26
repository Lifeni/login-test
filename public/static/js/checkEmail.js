/**
 * 进行邮箱的验证操作
 * 只作用于验证邮箱的页面
 */

'use strict';

const token = window.location.search.split('=')[1];
document.querySelector('#email').textContent = JSON.parse(
    window.atob(token.split('.')[1])
).email;

fetch('/token', {
    method: 'POST',
    body: JSON.stringify({
        token: token,
    }),
    headers: new Headers({
        'Content-Type': 'application/json',
    }),
})
    .then((res) => res.json())
    .catch((err) => {
        console.log(err);
    })
    .then((response) => {
        const color = document.querySelector('#color');
        if (response.code === 240) {
            console.log('Token 可用');
            color.classList.add('ok');
            document.querySelector('#result').textContent = '验证通过';
        } else if (response.code === 241) {
            console.log('Token 不可用');
            color.classList.add('error');
            document.querySelector('#result').textContent = '验证不通过';
        } else {
            console.log('Token 未知');
            color.classList.add('error');
            document.querySelector('#result').textContent = '未知错误';
        }
    });
