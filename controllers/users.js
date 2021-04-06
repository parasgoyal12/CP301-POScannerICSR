let passport = require('passport');
const {User}  = require('../models/users');
const {sendRegistrationDetails} = require('./util');
const crypto = require('crypto');

exports.getLoginPage = (req,res,next)=>{
    if(req.user){
        req.flash("success","Logged In already!");
        res.redirect("/");
    }
    else{
        res.render('users/login',{title:'Login',user:req.user,successFlash:req.flash("success")});
    }
};
exports.getRegisterPage = (req,res,next)=>{
    res.render('users/register',{title:'Register',user:req.user,successFlash:req.flash("success")});
};
exports.login = (req,res,next)=>{
    passport.authenticate('local',(err,user,info)=>{
        if(err){
            req.flash("success","Error While logging in.Check Username and Password");
            console.log(err);
            return res.redirect('/users/login');
        }
        if(!user){
            req.flash("success","Error While logging in.Check Username and Password");
            console.log(info);
            return res.redirect('/users/login');
        }
        req.login(user,(err)=>{
            if(err){
                req.flash("success","Error While logging in.Check Username and Password");
                console.log(err);
                return res.redirect('/users/login');
            }
            let rdrTo= req.session.redirectTo || '/';
            req.session.redirectTo=null;
            delete req.session.redirectTo;
            res.redirect(rdrTo);
        });
    })(req,res,next);
};

exports.logout= (req,res,next)=>{
    req.logout();
    req.flash("success","Logged out succesfully");
    res.redirect('/');
};


exports.register = (req,res,next)=>{
    let randomString = crypto.randomBytes(32).toString('base64').slice(0,8);
    console.log(randomString);
    User.register(new User(req.body),randomString).then(result=>{
        req.flash("success",`${result.name} Registered Succesfully!`);
        sendRegistrationDetails({email: result.email, password:randomString},result.email);
        res.redirect('/');
    }).catch(err=>{
        req.flash("success",err.message);
        res.redirect('/users/register');
    });
    // req.flash("success","Registered Succefully");
    // res.redirect('/');
}