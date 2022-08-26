const db = require('../db/index')

const bcrypt = require('bcryptjs')

exports.getUserInfo = (req, res) => {
    const sql = `select id, username, nickname, email, user_pic from ev_users where id=?`

    db.query(sql, req.user.id, (err,results)=>{
        if (err) return res.cc(err)

        if (results.length !== 1) return res.cc('Retrieved information failed!')

        res.send({
            status: 0,
            message: 'Retrieved information successfully!',
            data: results[0],
        })
    })
}

exports.updatePassword = (req, res) => {
    const sql = `select * from ev_users where id=?`

    db.query(sql, req.user.id, (err, results) => {
        if (err) return res.cc(err)

        if (results.length !== 1) return res.cc('User does not exist!')

        const compareResults = bcrypt.compareSync(req.body.oldPwd, results[0].password)

        if (!compareResults) return res.cc('Password incorrect!')

        const sqlStr = `update ev_users set password=? where id=?`

        const newPwd = bcrypt.hashSync(req.body.newPwd, 10)

        db.query(sqlStr, [newPwd, req.user.id], (err, results) => {
            if (err) return res.cc(err)
            
            if (results.affectedRows !== 1) return res.cc('Update password failed!')

            res.cc('Update password successfully!', 0)
        })
    })

}

exports.updateAvatar = (req, res) => {
    const sql = `update ev_users set user_pic=? where id=?`

    db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('Update picture failed!')
        return res.cc('Update picture successfully!',0)
    })
}