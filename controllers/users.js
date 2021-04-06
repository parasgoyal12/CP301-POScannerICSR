let passport = require('passport');
const {User}  = require('../models/users');

exports.getLoginPage = (req,res,next)=>{
    if(req.user){
        req.flash("success","Logged In already!");
        res.redirect("/");
    }
    else{
        res.render('users/login',{title:'Home',user:req.user,successFlash:req.flash("success")});
    }
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
    User.register(new User({email:"paras123@iitrpr.ac.in",name:"paras"}),"test123");
    req.flash("success","Registered Succefully");
    res.redirect('/');
}