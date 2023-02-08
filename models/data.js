const mysql = require('mysql');

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database: 'quanlysach'
    charset: 'utf8_general_ci'
})

module.exports = connection;
