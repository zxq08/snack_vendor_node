var mysql = require('mysql')
var config = require('./config.js')

module.exports = {
    query: function (sql, callback) {
        // 连接数据库
        let db = mysql.createConnection(config);
        db.connect((err) => {
            if(err) {
                res.json({
                code: "1",
                msg: err.message,
                })
            }
        })
        db.query(sql, function (error, result, field) {
            if(err){
                console.log('数据操作失败');
                throw err;
            }
            callback && callback(JSON.parse(JSON.stringify(results)), JSON.parse(JSON.stringify(fields)));
            connection.end(function(err){
                if(err){
                    console.log('关闭数据库连接失败！');
                    throw err;
                }
            });
        })
    }
}