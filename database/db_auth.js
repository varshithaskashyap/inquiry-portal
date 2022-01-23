const mysql = require('mysql');


const mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'inquiry_portal',
    multipleStatements: true
});

module.exports = mysqlConnection