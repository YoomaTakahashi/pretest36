const mysql2 = require('mysql2')
const pool = mysql2.createConnection({
    host:'localhost',
    user:'root',
    password:'1234',
    database:'practice1'
})
module.exports = pool.promise()