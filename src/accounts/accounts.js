const express = require('express');
var router = express.Router()

const mysqlConnection = require('../../database/db_auth.js')

const bcrypt = require('bcrypt');
const saltRounds = 10;



router.get("/", function (req, res) {
    var sess = req.session;
    if(sess.username) {
        res.redirect('/visitor');
    }
    else{
        res.render('accounts/index',{
            status:false
        });
    }
});


router.get("/login", function (req, res) {
    var sess = req.session;
    if(sess.username) {
        res.redirect('/visitor');
    }
    else{
        res.render('accounts/login',{
            status:false,
            message: ""
        });
    }
});


router.post("/login", function (req, res) {
    var sess = req.session;

    var user = {
        username: req.body.username,
        password: req.body.password,
    }

    mysqlConnection.query('SELECT * FROM users WHERE username = ?', user.username, function (error, results, fields) {
        if (results.length > 0) {
            bcrypt.compare(user.password, results[0].password, function (err, result) {
                if (result == true) {
                    sess.username = req.body.username;
                    sess.acc_id = results[0].acc_id
                    sess.position = results[0].position
                    if(sess.position == "Visitor") {
                        res.redirect('/visitor');
                    } else {
                        res.redirect('/agent');
                    }
                } else {
                    res.render('accounts/login',{
                        status:false,
                        message: "Username and password does not match"
                    });
                }

            });
        }
        else {
            res.render('accounts/login',{
                status:false,
                message: "Username does not exists"
            });
        }
    });
});



router.get("/signup", function (req, res) {
    var sess = req.session;
    if(sess.username) {
        // res.send("u have logged in")
        res.redirect('/visitor');
    }
    else{
        res.render('accounts/signup',{
            status:false,
            message :""
        });
    }

});


router.post('/signup', formValidate, (req, res) => {
    var sess = req.session;

    var user = {
        username: req.body.username,
        email: req.body.email,
        position: req.body.position,
        password: req.body.password,
    }

    bcrypt.hash(user.password, saltRounds, function (err, hash) {
        user.password = hash
        mysqlConnection.query('INSERT INTO users SET ?', user, function (error, results, fields) {
            if (error) throw error;
            // sess.username = req.body.username;
            // sess.position = req.body.position
            // res.redirect('/visitor');
            res.redirect('/login')
        });
    });
});


function checkUsername(name,callBack){
    mysqlConnection.query('SELECT * FROM users WHERE username = ?', name, function (error, results, fields) {
        if (results.length > 0) {
            callBack(true);
        }
        else{
            callBack(false);
        }
    });
}


function formValidate(req,res,next){

    if(req.body.password !== req.body.repassword ){
        res.render('accounts/signup',{
            status: false,
            message: "Passwords do not match"
        });
        return
    }

    checkUsername(req.body.username, function(userExists) {
        if(userExists == true){
            res.render('accounts/signup',{
                status: false,
                message: "Username already exists"
            });
            return
        }else{
            return next()
        }
    });
}

router.get("/logout", function (req, res) {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router