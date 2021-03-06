var express = require('express');
var router = express.Router();
const db = require('../db/db.js')

router.get('/', function (req, res, next) {
    let id = req.query.id
    let sql = `SELECT a.id, b.url, a.key_word, a.type, a.banner_id FROM banner_item a left join image b on b.id = a.img_id WHERE banner_id = '${id}'`
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
          data: {
            count: result.length,
            list: result
          }
        })
      }
    })
    next();
})
module.exports = router