/**
 * 用户页的脚本
 *
 * 1. 注销功能
 * 2. 获取填充用户信息
 * 3. 修改用户信息
 * 4. 修改密码
 * 5. 删除账号
 * 6. 其他页面处理，比如切换页面
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
    let hash = localStorage.getItem('hash');
    if (!hash || hash === 'home') {
        hash = '';
    }

    getProfile();
    setTimeout(() => {
        history.pushState(null, '', '/#/' + hash);
        document.querySelector('#loading').classList.add('hide');
        checkHash();
    }, 200);
});

const signout = document.querySelector('#signout');
signout.addEventListener('click', () => {
    localStorage.clear();
    signout.textContent = '已退出';
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
    document.querySelector('#avatar-preview').style.height = `${
        document.querySelector('#avatar-preview').getBoundingClientRect().width
    }px`;
    document.querySelectorAll('.tips').forEach((e) => {
        e.style.top = `-${e.getBoundingClientRect().height - 36}px`;
    });
}

let userData;
function getProfile() {
    fetch(`/profile?token=${localStorage.getItem('token')}`, {
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
            if (Number(response.code) === 300) {
                console.log('获取成功');
                userData = response.data;
            } else if (Number(response.code) === 301) {
                console.log('获取失败');
                userData = {
                    name: 'Error',
                    description: '获取信息失败',
                };
            } else {
                console.log('获取信息遇到未知错误');
                userData = {
                    name: 'Error',
                    description: '获取信息遇到未知错误',
                };
            }
            setData(userData);
        });
}

function setData(data) {
    document.querySelector('#home-avatar').src = data.avatar
        ? data.avatar
        : 'https://lifeni.oss-cn-beijing.aliyuncs.com/login-test/default-avatar.webp';
    document.querySelector('#email').textContent = data.email;
    document.querySelector('#confirm-email').placeholder = data.email;
    document.querySelector('#email-status').textContent = data.groupid
        ? '已验证'
        : '未验证';
    document.querySelector('#user-name').placeholder = data.name
        ? data.name
        : '你的名字';
    document.querySelector('#home-name').textContent = data.name
        ? data.name
        : data.email;
    document.querySelector('#home-description').textContent = data.description
        ? data.description
        : 'Welcome to the Test Page';
    document.querySelector('#user-description').placeholder = data.description
        ? data.description
        : '你想说的话';
    if (data.groupid) {
        document.querySelector('#check-email').classList.add('hide');
        document.querySelector('#user-profile').disabled = false;
    }
    if (data.avatar) {
        document.querySelector('#home-avatar').src = data.avatar;
        document.querySelector('#avatar-preview').src = data.avatar;
        setTimeout(() => {
            document.querySelector('#avatar-preview').style.height = `${
                document
                    .querySelector('#avatar-preview')
                    .getBoundingClientRect().width
            }px`;
        }, 0);
    }
}

const checkEmail = document.querySelector('#check-email');
checkEmail.addEventListener('click', (e) => {
    e.preventDefault();
    checkEmail.disabled = true;
    checkEmail.textContent = '正在发送 ...';
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
            if (Number(response.code) === 440) {
                console.log('发送成功');
                checkEmail.textContent = '发送成功';
            } else if (Number(response.code) === 441) {
                console.log('发送失败');
                checkEmail.textContent = '发送失败';
            } else {
                console.log('发送遇到未知错误');
                checkEmail.textContent = '未知错误';
            }
        });
});

const changeProfile = document.querySelector('#change-profile');
const userName = document.querySelector('#user-name');
const userDescription = document.querySelector('#user-description');
changeProfile.addEventListener('click', (e) => {
    console.log(userName.value, userDescription.value);

    e.preventDefault();
    fetch('/profile', {
        method: 'PUT',
        body: JSON.stringify({
            token: localStorage.getItem('token'),
            name: userName.value ? userName.value : userName.placeholder,
            description: userDescription.value
                ? userDescription.value
                : userDescription.placeholder,
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
            console.log('profile', response);

            if (Number(response.code) === 320) {
                console.log('修改成功');
                e.target.classList.remove('error');
                e.target.textContent = '修改成功';
                if (userName.value) {
                    document.querySelector('#home-name').textContent =
                        userName.value;
                }
                if (userDescription.value) {
                    document.querySelector('#home-description').textContent =
                        userDescription.value;
                }
            } else if (Number(response.code) === 321) {
                console.log('修改失败');
                e.target.classList.add('error');
                e.target.textContent = '修改失败';
            } else {
                console.log('修改信息遇到未知错误');
                e.target.classList.add('error');
                e.target.textContent = '未知错误';
            }
        });
});

userName.addEventListener('input', checkProfile);
userDescription.addEventListener('input', checkProfile);

function checkProfile() {
    if (!userName.value && !userDescription.value) {
        changeProfile.disabled = true;
    } else {
        changeProfile.disabled = false;
    }
    document.querySelector(
        '#description-tips'
    ).textContent = `限制字数：60 个字，已经写了 ${userDescription.value.length} 个字`;
    document.querySelectorAll('.tips').forEach((e) => {
        e.style.top = `-${e.getBoundingClientRect().height - 36}px`;
    });
    changeProfile.classList.remove('error');
    changeProfile.textContent = '保存修改';
}

const userAvatar = document.querySelector('#user-avatar');
const uploadAvatar = document.querySelector('#upload-avatar');
const avatarPreview = document.querySelector('#avatar-preview');

userAvatar.addEventListener('click', sendAvatar);
uploadAvatar.addEventListener('click', (e) => {
    e.preventDefault();
    userAvatar.click();
});

window.addEventListener('resize', () => {
    avatarPreview.style.height = `${
        avatarPreview.getBoundingClientRect().width
    }px`;
    document.querySelectorAll('.tips').forEach((e) => {
        e.style.top = `-${e.getBoundingClientRect().height - 36}px`;
    });
});

function sendAvatar(e) {
    console.log('upload');
    userAvatar.addEventListener('change', () => {
        console.log(e.target.files[0]);
        avatarPreview.style.height = `${
            avatarPreview.getBoundingClientRect().width
        }px`;
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = (ee) => {
            avatarPreview.src = ee.target.result;
        };
        if (e.target.files[0].size > 1 * 1024 * 1024) {
            uploadAvatar.classList.add('error');
            uploadAvatar.textContent = '图片有点大，不能上传';
        } else if (
            !e.target.files[0].type.includes('png') &&
            !e.target.files[0].type.includes('jpg') &&
            !e.target.files[0].type.includes('jpeg') &&
            !e.target.files[0].type.includes('webp') &&
            !e.target.files[0].type.includes('gif')
        ) {
            uploadAvatar.classList.add('error');
            uploadAvatar.textContent = '图片格式不对';
        } else {
            const formData = new FormData();
            formData.append('image', e.target.files[0]);
            formData.append('token', localStorage.getItem('token'));
            fetch('/avatar', {
                method: 'POST',
                body: formData,
            })
                .then((res) => res.json())
                .catch((err) => {
                    console.log(err);
                })
                .then((response) => {
                    if (Number(response.code) === 610) {
                        console.log('上传成功');
                        uploadAvatar.classList.remove('error');
                        uploadAvatar.textContent = '上传成功';
                        document.querySelector('#home-avatar').src =
                            avatarPreview.src;
                    } else if (Number(response.code) === 611) {
                        console.log('上传失败');
                        uploadAvatar.classList.add('error');
                        uploadAvatar.textContent = '上传失败';
                    } else {
                        console.log('上传图片遇到未知错误');
                        e.target.classList.add('error');
                        e.target.textContent = '未知错误';
                    }
                });
            uploadAvatar.classList.remove('error');
            uploadAvatar.textContent = '上传成功';
        }
    });
}

const changePassword = document.querySelector('#change-password');
const oldPassword = document.querySelector('#old-password');
const newPassword = document.querySelector('#new-password');
changePassword.addEventListener('click', (e) => {
    e.preventDefault();
    if (oldPassword.value === newPassword.value) {
        e.target.classList.add('error');
        e.target.textContent = '密码未改变';
    } else if (
        checkPasswordFormat(oldPassword.value) &&
        checkPasswordFormat(newPassword.value)
    ) {
        fetch('/password', {
            method: 'PUT',
            body: JSON.stringify({
                token: localStorage.getItem('token'),
                'old-password': oldPassword.value,
                'new-password': newPassword.value,
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
                if (Number(response.code) === 120) {
                    console.log('修改成功');
                    e.target.classList.remove('error');
                    e.target.textContent = '修改成功，请重新登录';
                    setTimeout(() => {
                        localStorage.clear();
                        window.location.href = '/';
                    }, 1000);
                } else if (Number(response.code) === 121) {
                    console.log('原密码错误');
                    e.target.classList.add('error');
                    e.target.textContent = '原密码错误';
                } else if (Number(response.code) === 122) {
                    console.log('账号不存在');
                    e.target.classList.add('error');
                    e.target.textContent = '账号不存在';
                } else {
                    console.log('修改密码遇到未知错误');
                    e.target.classList.add('error');
                    e.target.textContent = '未知错误';
                }
            });
    } else {
        e.target.classList.add('error');
        e.target.textContent = '格式不对';
    }
});

oldPassword.addEventListener('input', checkPassword);
newPassword.addEventListener('input', checkPassword);

function checkPassword() {
    if (!oldPassword.value || !newPassword.value) {
        changePassword.disabled = true;
    } else {
        changePassword.disabled = false;
    }
    changePassword.classList.remove('error');
    changePassword.textContent = '修改密码';
}

function checkPasswordFormat(text) {
    const re = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=.\-_*])([a-zA-Z0-9@#$%^&+=*.\-_]){3,}$/;
    if (text.length < 8 || text.length > 16) {
        console.log('密码长度不对');
        return false;
    } else if (!text.match(re)) {
        console.log('密码格式不对');
        return false;
    }
    return true;
}

const windowDelete = document.querySelector('#window-delete');
const deleteAccount = document.querySelector('#delete-account');
const confirmEmail = document.querySelector('#confirm-email');
const confirmButton = document.querySelector('#delete-confirm');

confirmEmail.addEventListener('input', (e) => {
    if (e.target.value === e.target.placeholder) {
        confirmButton.disabled = false;
    } else {
        confirmButton.disabled = true;
    }
});

deleteAccount.addEventListener('click', (e) => {
    e.preventDefault();
    windowDelete.classList.remove('hide');
    confirmEmail.focus();
    const cancel = document.querySelector('#delete-cancel');
    const close = document.querySelector('#delete-close');
    confirmButton.addEventListener('click', sendDeleteAccount);
    cancel.addEventListener('click', closeWindow);
    close.addEventListener('click', closeWindow);
    function closeWindow(e) {
        e.preventDefault();
        windowDelete.classList.add('hide');
        confirmButton.removeEventListener('click', sendDeleteAccount);
        cancel.removeEventListener('click', closeWindow);
        close.removeEventListener('click', closeWindow);
    }
});

function sendDeleteAccount(e) {
    e.preventDefault();
    fetch('/account', {
        method: 'DELETE',
        body: JSON.stringify({
            token: localStorage.getItem('token'),
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
            if (Number(response.code) === 130) {
                console.log('已删除');
                e.target.textContent = '已删除';
                setTimeout(() => {
                    localStorage.clear();
                    window.location.href = '/';
                }, 1000);
            } else if (Number(response.code) === 131) {
                console.log('删除失败');
                e.target.textContent = '删除失败';
            } else {
                console.log('删除遇到未知错误');
                e.target.textContent = '未知错误';
            }
        });
}
