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
            let sql = `select b.order_id,b.order_no,b.user_id,b.total_price,b.status,b.total_count,b.snap_address,b.prepay_id,b.snap_items,
            GROUP_CONCAT(p.name,'|',p.price,',',b.product_count,':',p.main_img_url SEPARATOR ';' ) as products from product p RIGHT JOIN 
            (select o.id as order_id,o.order_no as order_no,o.user_id,o.total_price,o.status,o.total_count,o.snap_address,o.prepay_id,o.snap_items,
                op.product_id as product_id,
              op.count as product_count
                from order_list o left join order_product op on o.id=op.order_id
                where o.user_id = ${userid}) b
            on p.id=b.product_id`
            return db.query(sql, (err, result) => {
                if(err) {
                    res.json({
                        code: 1,
                        msg: err.message,
                    })
                } else {
                    for (var i in result) {
                        let productObjArr = []
                        let productStr = result[i].products;
                        let productArr = productStr.split(";");
                        for (var j in productArr) {
                            let name = productArr[j].split("|")[0]
                            let price = productArr[j].split("|")[1].split(",")[0]
                            let count = productArr[j].split(",")[1].split(":")[0]
                            let imgurl = productArr[j].split(":")[1]
                            productObjArr.push({name,price,count,imgurl})
                        }
                        result[i].products = productObjArr
                    }
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

// 指定订单
router.get('/orderById', function (req, res, next) {
    let orderId = req.query.id;
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
            let sql = `select b.order_id,b.order_no,b.user_id,b.total_price,b.status,b.total_count,b.snap_address,b.prepay_id,b.snap_items,
            GROUP_CONCAT(p.name,'|',p.price,',',b.product_count,':',p.main_img_url SEPARATOR ';' ) as products from product p RIGHT JOIN 
            (select o.id as order_id,o.order_no as order_no,o.user_id,o.total_price,o.status,o.total_count,o.snap_address,o.prepay_id,o.snap_items,
                op.product_id as product_id,
              op.count as product_count
                from order_list o left join order_product op on o.id=op.order_id 
                where o.user_id = ${userid} and o.id = ${orderId}) b
            on p.id=b.product_id`
            return db.query(sql, (err, result) => {
                if(err) {
                    res.json({
                        code: 1,
                        msg: err.message,
                    })
                } else {
                    for (var i in result) {
                        let productObjArr = []
                        let productStr = result[i].products;
                        let productArr = productStr.split(";");
                        for (var j in productArr) {
                            let name = productArr[j].split("|")[0]
                            let price = productArr[j].split("|")[1].split(",")[0]
                            let count = productArr[j].split(",")[1].split(":")[0]
                            let imgurl = productArr[j].split(":")[1]
                            productObjArr.push({name,price,count,imgurl})
                        }
                        result[i].products = productObjArr
                    }
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

/**
 * 订单号规则
 * D0 + date + count + userid
 */
// 生成订单
router.post('/createOrder', function (req, res, next) {
    let headers = req.headers;
    let tokenStr = headers.token || 'error' ;
    let params = req.body;
    let order_no = "D0" + formatDateToInt(new Date());
    let rand_no = Math.floor(Math.random()*10000);
    let total_price = params.totalPrice;
    let status = params.orderStatus;
    let total_count = params.totalCount;
    let snap_address = params.snapAddress;
    let productArr = params.products
    // productArr = JSON.stringify(params.products);
    // productArr=JSON.parse(productArr)
    let productIds = []
    for (var i in productArr) {
        let product_id = productArr[i].id;
        let count = productArr[i].count;
        productIds.push({product_id, count})
    }
    let tokenData = jwt.verify(tokenStr, sercet);
    let username = tokenData.username
    let sql = `SELECT id FROM user_info WHERE username = '${username}'`
    db.query(sql, (err, result0) => {
        if (err) {
            return err;
        } else {
            let userid = result0[0].id;
            order_no += rand_no*userid+Math.floor(Math.random()*100);
            order_no += userid
            let sql = `INSERT INTO order_list (order_no,user_id,total_price,\`status\`,total_count,snap_address) 
            VALUES 
            ('${order_no}',${userid},${total_price},${status},${total_count},${snap_address})`
            return db.query(sql, (err, result) => {
                if(err) {
                    res.json({
                        code: 1,
                        msg: err.message,
                    })
                } else {
                    let sql = `select max(id) as id from order_list`
                    return db.query(sql, (err, result2) => {
                        let new_order_id = result2[0].id
                        let sql =`INSERT into order_product 
                        (order_id, product_id, count)
                        values`;
                        for (var i in productIds) {
                            var ev_val = `(${new_order_id},${productIds[i].product_id},${productIds[i].count}),`
                            sql += ev_val
                        }
                        sql = sql.substring(0,sql.length-1);
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
                    })
                }
            })
        }
        next();
    })
})

// 更新订单状态
router.get('/updateStatusById', function (req, res, next) {
    let orderStatus = req.query.status;
    let orderId = req.query.id;
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
            let sql = `update order_list set STATUS=${orderStatus} where user_id = ${userid} and id = ${orderId}`
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

function formatDateToInt (dt) {
    if (dt instanceof Date) {
        var year = dt.getYear() + 1900;
        var month = dt.getMonth()+1;
        var day = dt.getDate();
        month = month>9 ? month+'' : '0'+month
        var dtStr = year + month + day + '';
        return dtStr;
    } else {
        console.log('dt is not Date type')
    }
}

module.exports = router