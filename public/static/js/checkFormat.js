/**
 * 检查邮箱和密码的格式
 *
 * 1. 检查邮箱格式
 * 2. 检查密码格式
 * 3. 返回格式是否正确
 *
 * @returns void
 */

const email = document.querySelector('#email');
const password = document.querySelector('#password');

async function checkEmailFormat() {
    const text = email.value;
    if (!text.includes('@')) {
        console.log('邮箱格式不对');
        return false;
    }
    return true;
}

async function checkPasswordFormat() {
    const text = password.value;
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

export async function checkFormat() {
    if ((await checkEmailFormat()) && (await checkPasswordFormat())) {
        console.log('检查通过');
        return true;
    }
    return false;
}
