const db = require('../db/index')

const bcrypt = require('bcryptjs')

const jwt = require('jsonwebtoken')

const config = require('../config')

exports.regUser = (req,res) => {
    const userinfo = req.body

    // if(!userinfo.username || !userinfo.password) {
    //     return  res.send({status: 1, message: 'Please enter username or password!'})
    // }
    // res.send('reguser OK')

    const sqlStr = `select * from ev_users where username=?`

    db.query(sqlStr,[userinfo.username], function(err,results){
        if (err) {
            // return res.send({status: 1, message: err.message})
            return res.cc(err)
        } 
        if (results.length > 0){
            // return res.send({status: 1, message: 'Username already registered!'})
            return res.cc('Username already registered!')
        }

        userinfo.password = bcrypt.hashSync(userinfo.password, 10)

        const sql = 'insert into ev_users set ?'

        db.query(sql, {username: userinfo.username, password: userinfo.password}, function(err,results){
            if(err){
                return res.cc(err)
            }

            if (results.affectedRows !== 1){
                // return res.send({status: 1, message: 'Failure! Please wait and come back later!'})
                return res.cc('Failure! Please wait and come back later!')
            }

            res.cc('Registered successfully!')
        })
    })


}

exports.login = (req, res) => {
    const userinfo = req.body
    const sqlStr = `select * from ev_users where username=?`

    db.query(sqlStr, userinfo.username, function(err, results){
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc('Login failed!')

        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
        if (!compareResult) {
            return res.cc('Login failed!')
        }

        const user = {...results[0], password: '', user_pic: ''}

        const tokenStr = jwt.sign(user, config.jwtSecretKey, {
            expiresIn: '10h',
        })

        res.send({
            status: 0,
            message: 'Login Successfully！',
            token:  'Bearer ' + tokenStr,
          })


    })
}