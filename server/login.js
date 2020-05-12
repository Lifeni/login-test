'use strict';

const axios = require('axios').default
const path = require('path')

const backend = 'http://localhost:10011'
const root = path.resolve(__dirname, '..')

const token = '459h4h3s69al'

module.exports = async (data) => {
    let result = {}
    await axios.post(backend, {
        date: data.data.date,
        email: data.data.email,
        password: data.data.password
    }).then((response) => {
        result = response.data
        result.token = token;
    }).catch((err) => {
        console.log(err);
    })

    return result
}