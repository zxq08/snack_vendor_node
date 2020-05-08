var express = require('express');
var router = express.Router();
const db = require('../db/db.js')
const jwt = require('jsonwebtoken');
const sercet = "love_sasa";

// 获取用户所有地址
router.get('/allAddressByUser', function (req, res, next) {
    let headers = req.headers;
    let tokenStr = headers.token || 'error' ;
    let tokenData = jwt.verify(tokenStr, sercet);
    var username = tokenData.username
    let sql = `SELECT id FROM user_info WHERE username = '${username}'`
    db.query(sql, (err, result0) => {
      if (err) {
        return err;
      } else {
        let userid = result0[0].id;
        let sql = `select * from user_address where is_delete = 0 and user_id = '${userid}'`
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
              data: result
            })
          }
        })
        next();
      }
    })
})

// 获取默认地址
router.get('/defaultAddressByUser', function (req, res, next) {
  let headers = req.headers;
  let tokenStr = headers.token || 'error' ;
  let tokenData = jwt.verify(tokenStr, sercet);
  var username = tokenData.username
  let sql = `SELECT id FROM user_info WHERE username = '${username}'`
  db.query(sql, (err, result0) => {
    if (err) {
      return err;
    } else {
      let userid = result0[0].id;
      let sql = `select * from user_address where is_delete = 0 and user_id = '${userid}' and is_default = 1`
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
            data: result
          })
        }
      })
      next();
    }
  })
})

// 获取指定id地址
router.get('/AddressByid', function (req, res, next) {
  let headers = req.headers;
  let tokenStr = headers.token || 'error' ;
  let add_id = req.query.id;
  let tokenData = jwt.verify(tokenStr, sercet);
  let username = tokenData.username
  let sql = `SELECT id FROM user_info WHERE username = '${username}'`
  db.query(sql, (err, result0) => {
    if (err) {
      return err;
    } else {
      let userid = result0[0].id;
      let sql = `select * from user_address where is_delete = 0 and user_id = '${userid}' and id = '${add_id}'`
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
            data: result
          })
        }
      })
      next();
    }
  })
})

// 删除用户地址
router.get('/deleteAddressById', function (req, res, next) {
  let headers = req.headers;
  let tokenStr = headers.token || 'error' ;
  let add_id = req.query.id;
  let tokenData = jwt.verify(tokenStr, sercet);
  let username = tokenData.username
  let sql = `SELECT id FROM user_info WHERE username = '${username}'`
  db.query(sql, (err, result0) => {
    if (err) {
      return err;
    } else {
      let userid = result0[0].id;
      let sql = `update user_address set is_delete = 1 where user_id = '${userid}' and id = '${add_id}'`
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
    }
  })
})

// 添加用户地址
router.post('/addAddress', function (req, res, next) {
  let headers = req.headers;
  let tokenStr = headers.token || 'error' ;
  let params = req.body;
  let add_name = params.name;
  let add_mobile = params.mobile;
  let add_province = params.province;
  let add_city = params.city;
  let add_country = params.country;
  let add_detail = params.detail;
  let add_default = params.isDefault;
  let add_label = params.label;
  let tokenData = jwt.verify(tokenStr, sercet);
  let username = tokenData.username
  let sql = `SELECT id FROM user_info WHERE username = '${username}'`
  db.query(sql, (err, result0) => {
    if (err) {
      return err;
    } else {
      let userid = result0[0].id;
      if (add_default) {
        let sql = `update user_address set is_default = 0 where user_id = '${userid}'`
        return db.query(sql, (err, result) => {
          if(err) {
            res.json({
              code: "1",
              msg: err.message,
            })
          } else {
            let sql = `insert into user_address (name,mobile,province,city,country,detail,user_id,is_default,label) values 
                ('${add_name}','${add_mobile}','${add_province}','${add_city}','${add_country}','${add_detail}','${userid}','${add_default}','${add_label}')`
            return db.query(sql, (err, result) => {
              if(err) {
                res.json({
                  code: "1",
                  msg: err.message,
                })
              } else {
                res.json({
                  code: "0",
                  msg: 'success',
                  data: result
                })
              }
            })
            next();
          }
        })
      } else {
        let sql = `insert into user_address (name,mobile,province,city,country,detail,user_id,is_default,label) values 
                ('${add_name}','${add_mobile}','${add_province}','${add_city}','${add_country}','${add_detail}','${userid}','${add_default}','${add_label}')`
        return db.query(sql, (err, result) => {
          if(err) {
            res.json({
              code: "1",
              msg: err.message,
            })
          } else {
            res.json({
              code: "0",
              msg: 'success',
              data: result
            })
          }
        })
        next();
      } 
    }
  })
})

// 修改用户地址
router.post('/updateAddressById', function (req, res, next) {
  let headers = req.headers;
  let tokenStr = headers.token || 'error' ;
  let params = req.body;
  let add_id = params.id;
  let add_name = params.name;
  let add_mobile = params.mobile;
  let add_province = params.province;
  let add_city = params.city;
  let add_country = params.country;
  let add_detail = params.detail;
  let add_default = params.isDefault;
  let add_label = params.label;
  let tokenData = jwt.verify(tokenStr, sercet);
  let username = tokenData.username
  let sql = `SELECT id FROM user_info WHERE username = '${username}'`
  db.query(sql, (err, result0) => {
    if (err) {
      return err;
    } else {
      let userid = result0[0].id;
      if (add_default) {
        let sql = `update user_address set is_default = 0 where user_id = '${userid}'`
        return db.query(sql, (err, result) => {
          if(err) {
            res.json({
              code: "1",
              msg: err.message,
            })
          } else {
            let sql = `update user_address set
                name='${add_name}',mobile='${add_mobile}',province='${add_province}',city='${add_city}',
                country='${add_country}',detail='${add_detail}',is_default='${add_default}',label='${add_label}'
                where user_id='${userid}' and id='${add_id}'`
            return db.query(sql, (err, result) => {
              if(err) {
                res.json({
                  code: "1",
                  msg: err.message,
                })
              } else {
                res.json({
                  code: "0",
                  msg: 'success',
                  data: result
                })
              }
            })
            next();
          }
        })
      } else {
        let sql = `update user_address set
            name='${add_name}',mobile='${add_mobile}',province='${add_province}',city='${add_city}',
            country='${add_country}',detail='${add_detail}',is_default='${add_default}',label='${add_label}'
            where user_id='${userid}' and id='${add_id}'`
        return db.query(sql, (err, result) => {
          if(err) {
            res.json({
              code: "1",
              msg: err.message,
            })
          } else {
            res.json({
              code: "0",
              msg: 'success',
              data: result
            })
          }
        })
        next();
      } 
    }
  })
})

module.exports = router