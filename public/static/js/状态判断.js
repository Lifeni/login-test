/**
 * 网页加载后进行登录状态判断
 *
 * 1. 检查是否有 Token
 * 2. 如果有则把 Token 发送到后端进行检查
 * 3. 根据 Token 的有无和状态进行跳转
 */

'use strict';

const token = localStorage.getItem('token');
if (token) {
    console.log('Token 存在', token);
    检查令牌是否有效(token);
} else {
    console.log('Token 不存在', token);
    跳转未登录页面();
}

function 检查令牌是否有效(token) {
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
            if (response.result) {
                console.log('Token 可用');
                跳转已登录页面();
            } else {
                console.log('Token 不可用');
                跳转未登录页面();
            }
        });
}

function 跳转已登录页面() {
    if (!window.location.href.includes('token')) {
        window.location.href = `/?token=${token}`;
    }
    console.log('进入已登录页面');
    setTimeout(() => {
        document.querySelector('#loading').classList.add('hide');
    }, 200);
}

function 跳转未登录页面() {
    // if (window.location.pathname === '/home/') {
    //     window.location.href = '/';
    // }
    console.log('进入未登录页面');
    document.querySelector('#loading').classList.add('hide');
    // setTimeout(() => {
    //
    // }, 200);
}
