const db = require('../db/index')


exports.getArticleCates = (req, res) => {
    const sql = `select * from ev_article_cate where is_delete=0 order by id asc`

    db.query(sql, (err, results) => {

        if (err) return res.cc(err)

        res.send({
            status: 0,
            message: 'Get article list successfully!',
            data: results,
        })
    })
}

exports.addArticleCates = (req, res) => {
    const sql = `select * from ev_article_cate where name=? or alias=?`
    db.query(sql, [req.body.name, req.body.alias], (err, results) => {

        if (err) return res.cc(err)

        if (results.length === 2) return res.cc('Type name or alias already taken!')

        if (results.length === 1 && results[0].name === req.body.name) {
            return res.cc('Type name already taken!')
        }
        if (results.length === 1 && results[0].alias === req.body.alias) {
            return res.cc('Alias already taken!')
        }

        const sql = `insert into ev_article_cate set ?`

        db.query(sql, req.body, (err, results) => {
            if (err) return res.cc(err)

            if (results.affectedRows !== 1) return res.cc('Add new type failed!')

            res.cc('Add new type successfully!', 0)
        })
    })
}

exports.deleteCateById = (req, res) => {
    const sql = `update ev_article_cate set is_delete=1 where id=?`

    db.query(sql, req.params.id, (err, results) => {

        if (err) return res.cc(err)

        if (results.affectedRows !== 1) return res.cc('Delete article type failed!')

        res.cc('Delete article type successfully!', 0)
    })
}

exports.getArticleById = (req, res) => {
    const sql = `select * from ev_article_cate where id=?`

    db.query(sql, req.params.id, (err, results) => {
        if (err) return res.cc(err)

        if (results.length !== 1) return res.cc('Get date failed!')
        res.send({
            status: 0,
            message: 'Get data successfully!',
            data: results[0],
        })
    })
}

exports.updateCateById = (req, res) => {
    const sql = `select * from ev_article_cate where Id<>? and (name=? or alias=?)`

    db.query(sql, [req.body.Id, req.body.name, req.body.alias], (err, results) => {

        if (err) return res.cc(err)

        if (results.length === 2) return res.cc('Type name or alias already taken!')

        if (results.length === 1 && results[0].name === req.body.name) {
            return res.cc('Type name already taken!')
        }
        if (results.length === 1 && results[0].alias === req.body.alias) {
            return res.cc('Alias already taken!')
        }
        const sql = `update ev_article_cate set ? where Id=?`

        db.query(sql, [req.body, req.body.Id], (err, results) => {
            if (err) return res.cc(err)

            if (results.affectedRows !== 1) return res.cc('Update new type failed!')

            res.cc('Update new type successfully!', 0)
        })
    })
}