var express = require('express');
var router = express.Router();
const mysql = require('mysql');

// 连接数据库
let db = mysql.createConnection({
    host: 'localhost',
    user: 'zxq',
    password: 'zxq0825',
    database: "zerg"
  });
  db.connect((err) => {
    if(err) {
      res.json({
        status: "1",
        msg: err.message,
      })
    }
  })

router.get('/addressList', function (req, res, next) {
    let sql = `select * from user_address where is_delete = 0`
    console.log(sql);
    return db.query(sql, (err, result) => {
      console.log(result)
      if(err) {
        res.json({
          status: "1",
          msg: err.message,
        })
      } else {
        res.json({
          status: "0",
          msg: '',
          result: {
            count: result.length,
            list: result
          }
        })
      }
    })
    next();
})

router.get('/addressById', function (req, res, next) {
    console.log(req.query.id);
    let id = req.query.id
    let sql = `select * from user_address where is_delete = 0 and user_id = '${id}'`
    console.log(sql);
    return db.query(sql, (err, result) => {
      console.log(result)
      if(err) {
        res.json({
          status: "1",
          msg: err.message,
        })
      } else {
        res.json({
          status: "0",
          msg: '',
          result
        })
      }
    })
    next();
})

router.get('/deleteAddressById', function (req, res, next) {
    console.log(req.query.id);
    let id = req.query.id
    let sql = `update user_address set is_delete = 1 where user_id = '${id}'`
    console.log(sql);
    return db.query(sql, (err, result) => {
      console.log(result)
      if(err) {
        res.json({
          status: "1",
          msg: err.message,
        })
      } else {
        res.json({
          status: "0",
          msg: 'success',
        })
      }
    })
    next();
})
module.exports = router