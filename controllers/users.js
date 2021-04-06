let passport = require('passport');
const {User,Token}  = require('../models/users');
const {sendRegistrationDetails,sendResetToken} = require('./util');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const keys = require('../config/keys');

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

const requestPasswordReset = async (email)=>{
    const user = await User.findOne({email});
    if(!user)throw new Error("User does not exists");
    let token = await Token.findOne({userId : user._id});
    if(token) await token.deleteOne();
    let resetToken = crypto.randomBytes(32).toString("hex");

    await new Token({
        userId: user._id,
        token: resetToken,
        createdAt: Date.now(),
    }).save();

    const link = `${keys.clientURL}/passwordReset?token=${resetToken}&id=${user._id}`;
    sendResetToken(link,user.email);
    return link;
};

const resetPassword = async (userId, token, password) => {
    let passwordResetToken = await Token.findOne({ userId });
    if (!passwordResetToken) {
      throw new Error("Invalid or expired password reset token");
    }
    if(passwordResetToken.token != token){
        throw new Error("Invalid or expired password reset token");
    }
    const user = await User.findById({ _id: userId });
    await user.setPassword(password);
    await passwordResetToken.deleteOne();
    return true;
  };

exports.getResetRequestPage = (req,res,next) =>{
    res.render('users/passwordResetRequest',{title:'Password Reset',user:req.user,successFlash:req.flash("success")});
}
exports.passwordResetRequest = (req,res,next)=>{
    requestPasswordReset(req.body.email).then(result=>{
        console.log(result);
        req.flash("success","Password Reset Token Sent to your email.");
        res.redirect('/');
    })
    .catch(err=>{
        req.flash("success","Email ID Does not exists!");
        res.redirect('/users/passwordResetRequest');
    });
};

exports.getResetPasswordPage = (req,res,next)=>{
    res.render('users/resetPassword',{title:'Password Reset',user:req,user,successFlash:req.flash("success")});
};

exports.resetPasswordPage = (req,res,next)=>{
    console.log(req.body);
    resetPassword(req.body.id,req.body.token,req.body.password),then(result=>{
        req.flash("success","Password Reset Succesfully");
        res.redirect('/');
    }).catch(err=>{
        req.flash("success",err.message);
        res.redirect('/');
    });
}