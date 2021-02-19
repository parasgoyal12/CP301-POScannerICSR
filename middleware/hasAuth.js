let createError= require("http-errors");
exports.isLoggedIn=(req,res,next)=>{
    if(req.isAuthenticated()){
        next();
    }
    else{
        // next(createError(403,"You Must Login to continue."));
        req.session.redirectTo=req.originalUrl;
        res.redirect('/auth/google');
    }
};