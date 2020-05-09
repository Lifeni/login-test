'use strict';

const num1 = Math.round(Math.random() * 20);
const num2 = Math.round(Math.random() * 20);
const answer = num1 + num2;
document.querySelector('#captcha-text').innerText = `${num1} + ${num2} = ?`;