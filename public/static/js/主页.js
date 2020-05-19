/**
 * 主页的脚本
 *
 * 1. 注销功能
 * 2. 获取填充用户信息
 * 3. 修改用户信息
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const hash = localStorage.getItem('hash')
        ? localStorage.getItem('hash')
        : '/';
    getInfo();
    setTimeout(() => {
        history.pushState(null, '', '/#/' + hash);
        document.querySelector('#loading').classList.add('hide');
        checkHash();
    }, 200);
});

const signout = document.querySelector('#signout');
signout.addEventListener('click', () => {
    localStorage.clear();
    signout.innerText = '已退出';
    setTimeout(() => {
        window.location.reload();
    }, 1000);
});

window.addEventListener('hashchange', checkHash);

function checkHash() {
    const page =
        window.location.hash.split('/')[1] === ''
            ? 'home'
            : window.location.hash.split('/')[1];
    localStorage.setItem('hash', page);
    document.querySelectorAll('main').forEach((main) => {
        main.classList.add('hide');
    });
    document.querySelectorAll('.nav-link').forEach((link) => {
        link.classList.remove('this-page');
    });
    document.querySelector(`#page-${page}`).classList.remove('hide');
    document.querySelector(`#link-${page}`).classList.add('this-page');
}

let userData;
function getInfo() {
    fetch(`/info?token=${localStorage.getItem('token')}`, {
        method: 'GET',
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
            userData = response.data;
            setInfo(response);
            if (response.code === 0) {
                console.log('获取成功');
            } else {
                console.log('获取失败');
            }
        });
}

function setInfo(data) {
    document.querySelector('#email').innerText = data.data.email;
    document.querySelector('#email-status').innerText = data.data.verified
        ? '已验证'
        : '未验证';
    document.querySelector('#user-name').placeholder = data.data.name
        ? data.data.name
        : '未设置';
    document.querySelector('#home-name').innerText = data.data.name
        ? data.data.name
        : data.data.email;
    document.querySelector('#home-description').innerText = data.data
        .description
        ? data.data.description
        : 'Welcome to the Test Page';
    document.querySelector('#user-description').placeholder = data.data
        .description
        ? data.data.description
        : '未设置';
    if (data.data.verified) {
        document.querySelector('#check-email').classList.add('hide');
        // document.querySelector('#user-profile').disabled = false;
    }
}

const checkEmail = document.querySelector('#check-email');
checkEmail.addEventListener('click', (e) => {
    e.preventDefault();
    checkEmail.disabled = true;
    checkEmail.innerText = '正在发送 ...';
    const email = document.querySelector('#email');
    console.log(userData);

    fetch('/email', {
        method: 'POST',
        body: JSON.stringify({
            token: localStorage.getItem('token'),
            email: userData.email,
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
                console.log('发送成功');
                checkEmail.innerText = '发送成功';
            } else {
                console.log('发送失败');
                checkEmail.innerText = '发送失败';
            }
        });
});
