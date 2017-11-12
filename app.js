var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var sequelize = require('./config/models').sequelize;
var bodyParser = require('body-parser');
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

var index = require('./routes/index');
var users = require('./routes/users');
var submit = require('./routes/submit');

// the user are models are included below
var User = require('./config/models').User;
var UserValidate = require('./config/models').validate;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

sequelize
    .authenticate()
    .then(() => {
    console.log('Connection has been established successfully.');
})
.catch(err => {
    console.error('Unable to connect to the database:', err);
});
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: "cats", saveUninitialized: true, resave: true}));

passport.use(new LocalStrategy(
    function(username, password, done){
        User.findOne({where: {username: username}}).then(function(user){
            if(!user) return done(null, false, { message: 'Incorrect username.' });
            if (!UserValidate(user,password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
    }
));



passport.serializeUser(function(user, done){
    done(null, user.get('id'));
});

//Deserialize Sessions
passport.deserializeUser(function(id, done){
    User.findById(id).then(function(user){
        done(null, user);
    }).error(function(err){
        done(err, null)
    });
});

// For Authentication Purposes
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next){
    res.locals.user = req.user;
    next();
});

function allowAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/users/login');
}
app.use('/',index);
app.use('/submit', allowAuthenticated,submit);
app.use('/users', users);
app.post('/login',
    passport.authenticate('local', { successRedirect: '/users/dashboard',
        failureRedirect: '/users/login'
        })
);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
