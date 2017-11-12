const Sequelize = require('sequelize');
var bcrypt = require('bcrypt');

var saltRounds = 10;

var sequelize = new Sequelize('blogee-node','suresh1999','secretpasssword',{
    host : 'localhost',
    dialect : 'postgres',
    pool : {
        max : 5,
        min : 0,
        idle : 10000
    }
});

var User = sequelize.define('user',{
    username : {
        type : Sequelize.STRING,
        field : 'username',
        unique : true
    },
    password : {
        type : Sequelize.STRING,
        field : 'password'
    },
    email : {
        type : Sequelize.STRING,
        validate : {
            isEmail : true
        },
        unique : true
    }
},{freezeTableName : true});

var Post = sequelize.define('post',{
    title : {
        type : Sequelize.STRING,
        field : 'title'
    },
    body : {
        type : Sequelize.STRING,
        field : 'body'
    }
}, {freezeTableName : true});

var Comment = sequelize.define('comment',{
    content : {
        type : Sequelize.STRING,
        field : 'content'
    },
    email : {
        type : Sequelize.STRING,
        field : 'email',
        validate : {
            isEmail : true
        }
    },
    name : {
        type : Sequelize.STRING,
        field : 'name'
    }
}, { freezeTableName : true });

User.hasMany(Post);
Post.belongsTo(User);
Post.hasMany(Comment);


function validatePassword(user, password){
    var test = bcrypt.compareSync(password, user.get('password'));
    if (test){
        return true;
    } else {
        return false;
    }
}

User.sync({force:false});
Post.sync({force:false});
Comment.sync({force:false});
module.exports.validate = validatePassword;
module.exports.User = User;
module.exports.Post = Post;
module.exports.Comment = Comment;
module.exports.sequelize = sequelize;


