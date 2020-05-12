'use strict'

const form = document.querySelector('form')
const email = document.querySelector('#email')
const password = document.querySelector('#password')
const submit = document.querySelector('#submit')

const emailError = document.querySelector('#email + .error')
const passwordError = document.querySelector('#password + .error')

const page = submit.name

form.addEventListener('submit', (e) => {
    e.preventDefault()
})

email.addEventListener('input', () => {
    emailError.innerText = ''
})

password.addEventListener('input', () => {
    passwordError.innerText = ''
})


submit.addEventListener('click', async () => {
    if (await checkInput()) {
        await sendData()
    }
})

async function checkInput() {
    if (await checkEmail(email.value) &&
        await checkPassword(password.value)) {
        const captcha = document.querySelector('#captcha')
        if (captcha && captcha.dataset.verified !== 'true') {
            return false
        }
        return true;
    }
    return false
}

async function checkEmail(text) {
    emailError.innerText = '';
    if (!(text.includes('@')) ||
        !(text.includes('.'))) {
        emailError.innerText = '邮箱格式不对';
        return false;
    }
    return true;
}

async function checkPassword(text) {
    passwordError.innerText = '';
    const re = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=.\-_*])([a-zA-Z0-9@#$%^&+=*.\-_]){3,}$/
    if (text.length < 8 ||
        text.length > 16) {
        passwordError.innerText = '密码长度不对'
        return false;
    } else if (!text.match(re)) {
        passwordError.innerText = '密码格式不对'
        return false;
    }
    return true;
}

async function sendData() {
    submit.innerText = 'Connecting'
    submit.disabled = true

    const data = {
        date: new Date().getTime(),
        page: page,
        email: email.value,
        password: password.value
    }

    fetch(`/${page}`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    })
        .then(res => res.json())
        .catch((err) => {
            console.log(err)
        }).then((response) => {
            console.log(response);
            if (response.code === '0') {
                submit.innerText = 'OK'
                if (response.token) {
                    localStorage.setItem('token', response.token)
                }
                window.location.href = '/'
            } else {
                submit.classList.add('error')
                submit.innerText = response.message
            }
        })
}