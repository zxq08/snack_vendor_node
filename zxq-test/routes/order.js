var express = require('express');
var router = express.Router();
const db = require('../db/db.js')
const jwt = require('jsonwebtoken');
const sercet = "love_sasa";

// 所有订单
router.get('/orders', function (req, res, next) {
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
            let sql = `SELECT a.*,GROUP_CONCAT(c.id,',',b.count SEPARATOR '|') as products FROM order_list as a 
            JOIN order_product as b ON a.id=b.order_id JOIN product as c ON b.product_id=c.id
            where a.user_id = ${userid} GROUP BY a.id`
            return db.query(sql, (err, result) => {
                if(err) {
                    res.json({
                        code: 1,
                        msg: err.message,
                    })
                } else {
                    let orderData = result[0];
                    res.json({ 
                        code: 0,
                        msg: 'success',
                        data: orderData
                    })                  
                }
            })
        }
        next();
    })
})

// 指定订单
router.get('/orderById', function (req, res, next) {
    let id = req.query.id
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
            let sql = `SELECT * FROM order_list where user_id = ${userid} and id = ${id}`
            return db.query(sql, (err, result) => {
                if(err) {
                    res.json({
                        code: 1,
                        msg: err.message,
                    })
                } else {
                    res.json({
                        code: 0,
                        msg: 'success',
                        data: result
                    })
                }
            })
        }
        next();
    })
  
})

// 生成订单
router.post('/createOrder', function (req, res, next) {
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
            let sql = `SELECT * FROM order_list where user_id = ${userid} and id = ${id}`
            return db.query(sql, (err, result) => {
                if(err) {
                    res.json({
                        code: 1,
                        msg: err.message,
                    })
                } else {
                    res.json({
                        code: 0,
                        msg: 'success',
                        data: result
                    })
                }
            })
        }
        next();
    })
})


module.exports = router