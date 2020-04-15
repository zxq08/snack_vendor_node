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
    console.log('connect success snack_vendor!')
})

router.get('/', function (req, res, next) {
    console.log(req.query.id);
    let id = req.query.id
    let sql = `SELECT * FROM banner_item WHERE banner_id = '${id}'`
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
module.exports = router