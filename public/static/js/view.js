'use strict'

const home = document.querySelector('#home')
const chat = document.querySelector('#chat')

const token = localStorage.getItem('token')
if (token) {
    chat.querySelector('#token').innerText = token
    home.classList.add('hide')
    chat.classList.remove('hide')
    getInfo()
} else {
    home.classList.remove('hide')
    chat.classList.add('hide')
}

function getInfo() {

}