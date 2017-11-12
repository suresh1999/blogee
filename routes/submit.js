var express = require('express')
var router = express.Router();
var Post = require('../config/models').Post;
var User = require('../config/models').User;

router.get('/post',function (req,res,next) {
    res.render('/submit/post.ejs');
})

router.post('/post',function(req,res){
    var titl = req.body.title;
    var cont = req.body.content;
    Post.create({ title : titl, body : cont}).then(function(post){
        User.findById(req.user.id).then(function(user){
            user.addPost(post);
            post.setUser(user);
        });
        res.send("post successfully creted")
    })

})

module.exports = router;