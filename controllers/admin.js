const {User}  = require('../models/users');

exports.getIndex = (req,res,next) =>{
    res.render('admin/index',{title:'Admin',user:req.user,successFlash:req.flash("success")});
};

exports.getRegUsers = (req,res,next) =>{
    User.find()
        .then((result) =>{
            res.render('admin/registeredUsers',{title:'Registered Users',users:result,user:req.user,successFlash:req.flash("success")});
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

exports.getUserToUpdate = (req,res,next) =>{
    User.findById(req.params.id).then(result=>{
        if(result)
        res.render('admin/updateUser',{title:"Update User",user_info:result,user:req.user,successFlash:req.flash("success")});
        else next();
    }).catch(err=>{
        console.log(err);
        next();
    });
}

exports.updateUser = (req,res,next) =>{
    console.log(req.params,req.body);
    User.findByIdAndUpdate(req.params.id,{$set:req.body}).then(result=>{
        req.flash("success",`User ${result.email} Updated Successfully!`);
        res.redirect('/');
    }).catch(err=>res.send(err.message));
}