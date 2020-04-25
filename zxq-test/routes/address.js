var express = require('express');
var router = express.Router();
const db = require('../db/db.js')
const jwt = require('jsonwebtoken');
const sercet = "love_sasa";

// 获取用户地址
router.get('/addressById', function (req, res, next) {
    let headers = req.headers;
    console.log(headers.token);
    let tokenStr = headers.token || 'error' ;
    var id = getUserId(tokenStr);
    console.log(req.query.id);
    let id = req.query.id
    let sql = `select * from user_address where is_delete = 0 and user_id = '${id}'`
    console.log(sql);
    return db.query(sql, (err, result) => {
      console.log(result)
      if(err) {
        res.json({
          code: "1",
          msg: err.message,
        })
      } else {
        res.json({
          code: "0",
          msg: '',
          data: {}
        })
      }
    })
    next();
})

// 删除用户地址
router.get('/deleteAddressById', function (req, res, next) {
    console.log(req.query.id);
    let id = req.query.id
    let sql = `update user_address set is_delete = 1 where user_id = '${id}'`
    console.log(sql);
    return db.query(sql, (err, result) => {
      console.log(result)
      if(err) {
        res.json({
          code: "1",
          msg: err.message,
        })
      } else {
        res.json({
          code: "0",
          msg: 'success',
          data: {}
        })
      }
    })
    next();
})

// 添加用户地址
router.get('/addAddressById', function (req, res, next) {
  console.log(req.query.id);
  let id = req.query.id
  let sql = `update user_address set ... where user_id = '${id}'`
  console.log(sql);
  return db.query(sql, (err, result) => {
    console.log(result)
    if(err) {
      res.json({
        code: "1",
        msg: err.message,
      })
    } else {
      res.json({
        code: "0",
        msg: 'success',
        data: {}
      })
    }
  })
  next();
})

// 修改用户地址
router.post('/updateAddressById', function (req, res, next) {
  let params = req.body;
  let headers = req.headers;
  console.log(headers.token);
  let tokenStr = headers.token || 'error' ;
　let address = params.address;
  let address_id = address.id;
  let tokenData = jwt.verify(tokenStr, sercet);
  console.log(tokenData)
  console.log(address_id)
  var username = tokenData.username
  var password = tokenData.password
  let sql = `SELECT * FROM user_info WHERE username = '${username}'`
  db.query(sql, (err, result_address) => {
    if (err) {
      console.log(err)
      res.json({
        code: 1,
        msg: 'token.username is wrong',
        data: ''
      })
      return false;
    } else if (password === result_address[0].password) {
      if (address) {
        const user_id = result_address.id;
        let update_sql = `update user_address set ... where id = '${address_id}' && user_id = '${user_id}'`;
        db.query(update_sql, (err, result_avatarurl) => {
          if (err) {
            console.log(err)
            res.json({
              code: 1,
              msg: 'update failed',
              data: ''
            })
            return false;
          } else {
            res.json({
              code: 0,
              msg: 'update address success',
              data: ''
            })
          }
        })
      } else {
        res.json({
          code: 1,
          msg: 'address is wrong',
          data: ''
        })
      }
    } else {
      res.json({
        code: 1,
        msg: 'token.password is wrong',
        data: ''
      })
    }
  })
})

function getUserId (userToken) {
  let tokenData = jwt.verify(tokenStr, sercet);
  console.log(tokenData)
  var username = tokenData.username
  var password = tokenData.password
}
module.exports = router