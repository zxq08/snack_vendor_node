var express = require('express');
var router = express.Router();
const db = require('../db/db.js')

// 商品详情
router.get('/productById', function (req, res, next) {
    let id = req.query.id
    let sql = `SELECT id, name, price, stock, main_img_url, summary FROM product WHERE id = '${id}'`
    return db.query(sql, (err, result) => {
      if(err) {
        res.json({
          code: 1,
          msg: err.message,
        })
      } else {
        res.json({
          code: 0,
          msg: '',
          data: result
        })
      }
    })
    next();
})

// 新品
router.get('/productTop', function (req, res, next) {
  let num = req.query.num
  let sql = `SELECT id, name, price, stock, main_img_url, summary FROM product order by create_time desc limit ${num}`
  console.log(sql);
  return db.query(sql, (err, result) => {
    if(err) {
      res.json({
        code: 1,
        msg: err.message,
      })
    } else {
      res.json({
        code: 0,
        msg: '',
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
  let sql = `select a.id as category_id,a.name as catogary_name,a.description, c.url 
  from category a LEFT JOIN image c on a.topic_img_id = c.id`
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

module.exports = router