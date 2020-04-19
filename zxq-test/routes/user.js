var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const sercet = "love_sasa";

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

// 登录验证
router.post('/login', function (req, res) {
  console.log(req.body);
  let params = req.body;
　let username = params.username;
　let password = params.password;
  let sql = `SELECT * FROM user_info WHERE username = '${username}'`
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      resultData = result[0]
      if (resultData.password === password) {
        console.log("success!")
        var data = '';
        req.on('data', function (chunk) {
          data += chunk;
        })
        req.on('end', function () {
          console.log(data)
        })
        const token = jwt.sign({
          username,
          password,
          'time': Date.now(),
        },sercet,{expiresIn:60*60*24*7});
        res.json({
          code: 0,
          msg: 'success',
          data: token
        });
      } else {
        return false
      }
    }
  })
})



module.exports = router;
