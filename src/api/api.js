const express = require('express');
var router = express.Router()

const mysqlConnection = require('../../database/db_auth.js')

router.get("/api/checkusername", function (req, res) {
   let name = req.query.username;
   mysqlConnection.query('SELECT * FROM users WHERE username = ?', name, function (error, results, fields) {
    if (results.length > 0) {
        res.send(false);
    }
    else{
        res.send(true);
    }
    });
});




module.exports = router