var express = require('express');
var router = express.Router();
var User = require('../config/models').User;
var expressValidator = require('express-validator');
var bcrypt = require('bcrypt');
const Sequelize = require('sequelize');

var saltRounds = 10;
/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(res.user);
  res.end();
});

router.get('/login',function(req,res,next){
    res.render('users/login.ejs');
});

router.get('/logout',function(req,res,next){
    req.logout();
    res.redirect('/users/login');
    next();
})

router.get('/register', function(req,res,next){
    res.render('users/register.ejs');
});

router.post('/register', function(req,res,next){
    var user = req.body.username;
    var pass = req.body.password;
    var emailadd = req.body.email;
    var hash = bcrypt.hashSync(pass, saltRounds);
    User.create({
        username : user,
        password : hash,
        email : emailadd
    }).then(
        function(){
            res.send("Successfully created the account");
        }
    ) .catch(Sequelize.UniqueConstraintError,function(err){
        res.send("this username / email is already taken by someone");
    });
});

router.get('/dashboard',function(req,res){
    if(req.isAuthenticated()) {
        req.user.getPosts().then(function(post){
            console.log(post);
            res.render('dashboard.ejs',{post:post})
        })

    }
    else
        res.send("fuck off")
});


module.exports = router;
