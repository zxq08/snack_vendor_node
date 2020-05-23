var express = require('express');
var router = express.Router();
const db = require('../db/db.js')
const jwt = require('jsonwebtoken');
const sercet = "love_sasa";

// 登录验证,未注册就注册且自动登录
router.post('/login', function (req, res) {
  let params = req.body;
　let username = params.username;
　let password = params.password;
  let sql = `SELECT * FROM user_info WHERE username = '${username}'`
  let psw = '';
  db.query(sql, (err, result0) => {
    if (err) {
      res.json({
        code: 1,
        msg: ' error',
        data: ''
      })
      return false;
    } else if (result0.length === 0) {    // 未注册
      if (!username || !password) {
        res.json({
          code: 1,
          msg: 'register is error',
          data: ''
        })
        return false;
      }
      let sql1 = `INSERT into user_info (username,PASSWORD) VALUES ("'${username}'", "'${password}'")`
      db.query(sql1, (err, result1) => {
        if (err) {
          res.json({
            code: 1,
            msg: 'Register user error',
            data: ''
          })
          return false;
        } else {
          const token = jwt.sign({
            username,
            password,
            'time': Date.now(),
          },sercet,{expiresIn:60*60});
          let sql2 = `SELECT username, avatar FROM user_info WHERE username = '${username}'`
          db.query(sql1, (err, userRes) => {
            if (err) {
              res.json({
                code: 1,
                msg: 'Register user error',
                data: ''
              })
              return false;
            } else {
              res.json({
                code: 0,
                msg: 'success',
                data: { 
                  'token': token,
                  'userdata': userRes[0]
                }
              });
            }
          })
        }
      })
    } else {          // 已注册，验证登录
      resultData = result0[0]
      psw = resultData.password
      if (psw === password) {
        const token = jwt.sign({
          username,
          password,
          'time': Date.now(),
        },sercet,{expiresIn:60*60*24*7});
        res.json({
          code: 0,
          msg: 'success',
          data: { 
            'token': token,
            'userdata': {
              username: resultData.username,
              avatar: resultData.avatar
            }
          }
        });
      } else {
        res.json({
          code: 1,
          message: "username or password error",
          data: 'Login error'
        })
        return false
      }
    }
  })
})

// 修改头像
router.post('/updateAvatar', function (req, res) {
  let params = req.body;
  let headers = req.headers;
  let tokenStr = headers.token || 'error' ;
　let avatar = params.avatar_url;
  let tokenData = jwt.verify(tokenStr, sercet);
  var username = tokenData.username
  var password = tokenData.password
  let sql = `SELECT * FROM user_info WHERE username = '${username}'`
  db.query(sql, (err, result_avatar) => {
    if (err) {
      res.json({
        code: 1,
        msg: 'token.username is wrong',
        data: ''
      })
      return false;
    } else if (password === result_avatar[0].password) {
      if (avatar) {
        let update_sql = `update user_info set avatar = '${avatar}' where username = '${username}'`;
        db.query(update_sql, (err, result_avatarurl) => {
          if (err) {
            res.json({
              code: 1,
              msg: 'update failed',
              data: ''
            })
            return false;
          } else {
            res.json({
              code: 0,
              msg: 'update avatar success',
              data: ''
            })
          }
        })
      } else {
        res.json({
          code: 1,
          msg: 'avatar is wrong',
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

// 修改密码
router.post('/updatePsw', function (req, res) {
  let params = req.body;
  let headers = req.headers;
  let tokenStr = headers.token || 'error' ;
　let newpsw = params.newPassword;
  let tokenData = jwt.verify(tokenStr, sercet);
  var username = tokenData.username
  var password = tokenData.password
  let sql = `SELECT * FROM user_info WHERE username = '${username}'`
  db.query(sql, (err, result_newpsw) => {
    if (err) {
      res.json({
        code: 1,
        msg: 'token.username is wrong',
        data: ''
      })
      return false;
    } else if (password === result_newpsw[0].password) {
      if (newpsw) {
        let update_sql = `update user_info set password = '${newpsw}' where username = '${username}'`;
        db.query(update_sql, (err, result_newpsw_res) => {
          if (err) {
            res.json({
              code: 1,
              msg: 'update failed',
              data: ''
            })
            return false;
          } else {
            res.json({
              code: 0,
              msg: 'update password success',
              data: ''
            })
          }
        })
      } else {
        res.json({
          code: 1,
          msg: 'new_password is wrong',
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



module.exports = router;
