var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let passport = require('passport');
let session = require('express-session');
let mongoose = require('mongoose');

require('./passport_setup')(passport);
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const keys = require('./config/keys');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({secret:keys.session.cookieKey,resave:false,saveUninitialized:true}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);


app.get("/auth/google",passport.authenticate("google",{scope:["profile","email"]}));
app.get("/auth/google/redirect",passport.authenticate('google',{failureRedirect:'/auth/google',successRedirect:'/',failureFlash:true}));
app.get('/auth/logout',(req,res)=>{
  req.logout();
  req.session.destroy();
  res.redirect('/');
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

PORT= process.env.PORT || 3000;
mongoose.connect(keys.mongodb.dbURI,{useNewUrlParser: true,useUnifiedTopology:true})
.then(result=>{
  app.listen(PORT,()=>{
    console.log("Listening on PORT 3000");
  });
})
.catch(err=>console.log(err));

// console.log("blah");
module.exports = app;
