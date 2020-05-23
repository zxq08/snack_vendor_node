var express = require('express');
var router = express.Router();
const db = require('../db/db.js')

// 所有商品
router.get('/products', function (req, res, next) {
  let id = req.query.id
  let sql = `SELECT id, name, price, stock, category_id, main_img_url, summary FROM product`
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
  next();
})

// 商品详情
router.get('/productById', function (req, res, next) {
    let id = req.query.id
    let sql = `SELECT a.id, a.name, a.price, a.stock, a.category_id, a.main_img_url, a.summary,
    GROUP_CONCAT( attr.name,'|',attr.detail SEPARATOR ';' ) as attr
    FROM product a LEFT JOIN product_property attr
    on a.id = attr.product_id  WHERE a.id = '${id}'`
    return db.query(sql, (err, result) => {
      if(err) {
        res.json({
          code: 1,
          msg: err.message,
        })
      } else {
        let dataList = result
        let attrList = []
        dataList.forEach(item => {
          if (item.attr) {
            let attr0 = item.attr.split(";")
            attr0.forEach(item => {
              let name = item.split("|")[0]
              let detail = item.split("|")[1]
              attrList.push({name, detail})
            })
            item.attr = attrList
          }
        });
        res.json({
          code: 0,
          msg: 'success',
          data: dataList
        })
      }
    })
    next();
})

// 新品
router.get('/productTop', function (req, res, next) {
  let num = req.query.num
  let sql = `SELECT id, name, price, stock, category_id, main_img_url, summary FROM product order by create_time desc limit ${num}`
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
  next();
})

// 主题
router.get('/theme', function (req, res, next) {
  let sql = `select a.id as theme_id,a.name as theme_name,a.description,topic.url as topic_img_url,head.url as head_img_url
  from theme a LEFT JOIN image topic on a.topic_img_id = topic.id
  LEFT JOIN image head on a.head_img_id = head.id`
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
  next();
})

// 主题商品
router.get('/themeById', function (req, res, next) {
  let themeId = req.query.id;
  let sql = `SELECT id, name, price, stock, category_id, main_img_url, summary FROM product 
  where id in (select product_id from theme_product where theme_id = '${themeId}')`
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
  next();
})

// 商品分类
router.get('/category', function (req, res, next) {
  let sql = `select a.id as category_id,a.name as category_name,a.description, c.url ,
  p.id as product_id, p.name as product_name, p.main_img_url 
    from category a LEFT JOIN image c on a.topic_img_id = c.id 
  RIGHT JOIN product p on a.id = p.category_id ORDER BY category_id`
  return db.query(sql, (err, result) => {
    if(err) {
      res.json({
        code: 1,
        msg: err.message,
      })
    } else {
      let result0 = result
      let categoryArr = []
      for (var i =0; i<result0.length; i++) {
        let Cid = result0[i].category_id
        let hasIndex = categoryArr.findIndex(item => item.category_id === Cid)
        if (hasIndex !== -1) {
          categoryArr[hasIndex].products.push({
            product_id: result0[i].product_id,
            product_name: result0[i].product_name,
            main_img_url: result0[i].main_img_url
          })
        } else {
          categoryArr.push({
            category_id: result0[i].category_id,
            category_name: result0[i].category_name,
            description: result0[i].description,
            url: result0[i].url,
            products: [{
              product_id: result0[i].product_id,
              product_name: result0[i].product_name,
              main_img_url: result0[i].main_img_url
            }]
          })
        }
      }
      res.json({
        code: 0,
        msg: 'success',
        data: categoryArr
      })
    }
  })
  next();
})

module.exports = router