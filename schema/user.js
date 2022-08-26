const joi = require('joi')

const username = joi.string().alphanum().min(1).max(10).required()

const password = joi.string().pattern(/^[\S]{6,12}$/).required()

exports.reg_login_schema = {
    body: {
        username,
        password,
    },
}

exports.update_password_schema = {
    body: {
        oldPwd: password,
        newPwd: joi.not(joi.ref('oldPwd')).concat(password),
    },
}

const avatar = joi.string().dataUri().required()

exports.update_avatar_schema = {
    body: {
        avatar,
    },
}