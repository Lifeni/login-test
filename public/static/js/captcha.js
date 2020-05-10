'use strict';

document.addEventListener('DOMContentLoaded', () => {
    getCaptcha();
})

const captchaText = document.querySelector('#captcha-text');
const captcha = document.querySelector('#captcha');

captchaText.addEventListener('click', getCaptcha);

function getCaptcha() {
    const num1 = Math.round(Math.random() * 20);
    const num2 = Math.round(Math.random() * 20);
    const answer = num1 + num2;

    captchaText.innerText = `${num1} + ${num2} = ?`;

    captcha.addEventListener('input', (e) => {
        console.log(e);
        if (e.target.value === answer.toString()) {
            captcha.disabled = true;
            captchaText.innerText = 'Verified'
            captchaText.removeEventListener('click', getCaptcha);
        }
    })
}