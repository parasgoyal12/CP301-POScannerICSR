
exports.getIndex = (req,res,next) =>{
    res.render('admin/index',{title:'Admin',user:req.user,successFlash:req.flash("success")});
};