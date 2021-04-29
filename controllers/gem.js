exports.home = (req,res,next)=>{
    res.render('gem/index',{title:'GEM Home',user:req.user,successFlash:req.flash("success")});
};