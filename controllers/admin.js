const {User}  = require('../models/users');

exports.getIndex = (req,res,next) =>{
    res.render('admin/index',{title:'Admin',user:req.user,successFlash:req.flash("success")});
};

exports.getRegUsers = (req,res,next) =>{
    User.find({isAdmin:false})
        .then((result) =>{
            res.render('admin/registeredUsers',{title:'Registered Users',users:result,user:req.user});
        })
};

exports.deleteUser = (req,res,next)=>{
    User.findByIdAndDelete(req.params.id)
    .then(resp=>{
        console.log(resp);
        req.flash("success",`${resp.name} Deleted Succesfully!`);
        res.redirect('/admin/registeredUsers');
    })
    .catch((err)=>{
        console.log(err);
        req.flash("success","Delete Failed");
        res.redirect("/admin/registeredUsers");
    })
};