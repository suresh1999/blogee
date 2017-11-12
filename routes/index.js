var express = require('express');
var router = express.Router();
const Post = require('../config/models').Post;
var passport = require('passport-local');

function authenticationMiddleware () {
    return function (req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        }
        res.redirect('/users/login?next=' + req.url);
    }
}

/* GET home page. */
router.get('/post/create', authenticationMiddleware(), function(req, res, next) {
  res.render('submit/post', { title: 'Express' });
});

router.get('/post/:postid(\\d+)', function (req,res,next) {
    var pid = req.params.postid;
    Post.findById(pid).then((post) => {
      res.send(post.title);
    }).error((err) => {
      res.send('This post no longer exists');
    });
});

module.exports = router;
