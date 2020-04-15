const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const sercet = "love_sasa";

const app = express();

app.use(bodyParser.json());//数据JSON类型
app.use(bodyParser.urlencoded({ extended: false }));//解析post请求数据
app.all('*',function(req,res,next){  
  let origin=req.headers.origin;
  res.setHeader('Access-Control-Allow-Origin',"*");
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  next();
})

// 连接数据库
let db = mysql.createConnection({
  host: 'localhost',
  user: 'zxq',
  password: 'zxq0825',
  database: "snack_vendor"
});
db.connect((err) => {
  if(err) throw err;
  console.log('connect success snack_vendor!')
})

const router = express.Router();

router.get('/', function (req, res, next) {
  req.url = 'index.html';
  next();
});

app.use(router);
const apiRoutes = express.Router();

// 登录验证
app.post('/login', bodyParser.json(), function (req, res) {
    let params = req.body;
  　let username = params.username;
  　let password = params.password;
    let sql = `SELECT * FROM user WHERE username = '${username}'`
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
app.use('/api', apiRoutes);

app.use(express.static('./dist'));

module.exports = app.listen('8090', function (err) {
  if (err) {
    console.log(err);
    return
  }
  console.log('Listening at http://localhost:8090' + '\n')
});