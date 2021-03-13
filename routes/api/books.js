var express = require('express');
var router = express.Router();
var mysql = require('mysql2');

const connection_param = {
    "host" : "db",
    "database" : "react",
    "user" : "react",
    "password" : "react"
};

const pool = mysql.createPool(connection_param);


/* GET /api/books */
router.get('/', function(req, res, next) {
    const sql = "select * from book order by id";
    pool.getConnection((e, con) => {
        try {
            con.query(sql, (err, result, fields)=>{
                if(err){
                    throw err;
                }
                res.json(result);
            });
        } catch (error) {
            console.log(error);
            res.send("booksの取得でエラーが発生しました");
        } finally {
            if(con){
                con.release();
            }
        }
    });
});


/* POST /api/books */
router.post('/', function(req, res, next) {
    const sql = "insert into book (name, author, url, reg_time, update_time) values(?, ?, ?, now(), now());"
    pool.getConnection((e, con)=>{
        try {
            con.query(sql, [req.body.name, req.body.author, req.body.url], (e, r, f)=>{
                if(e){
                    throw e;
                }
                res.json({
                    insertedId : r.insertId,
                    message : "Success!"
                });
            });
        } catch (error) {
            console.log(error);
            res.send("booksの登録でエラーが発生しました");
        } finally {
            if(con){
                con.release();
            }
        }
    });
});


/* DELETE /api/books */
router.delete('/:id', function(req, res, next) {
    const sql = "delete from book where id = ?;"
    pool.getConnection((e, con)=>{
        try {
            const id = req.params.id;
            con.query(sql, [id], (e, r, f)=>{
                if(e){
                    throw e;
                }
                res.json({
                    deleteId : id,
                    message : "Success!"
                });
            });
        } catch (error) {
            console.log(error);
            res.send("booksの削除でエラーが発生しました");
        } finally {
            if(con){
                con.release();
            }
        }
    });
});

module.exports = router;
