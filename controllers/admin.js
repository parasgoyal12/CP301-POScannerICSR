const {User}  = require('../models/users');
const Form = require('../models/form');

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
    var userID = req.params.id;
    var savedFormsExist = false;
    var x = Form.find({User:userID})
        .then(
            (result)=>{
                if(result.length>0)
                {
                    savedFormsExist=true;
                }
            }
        )
        .catch((err)=>{
            savedFormsExist=false;
        })
    Promise.all([x]).then((result)=>{
        if(savedFormsExist)
        {
            req.flash("success","Delete Failed since user has unfinished forms");
            res.redirect("/admin/registeredUsers");
        }
        else{
            User.findByIdAndDelete(req.params.id)
            .then(resp=>{
                req.flash("success",`${resp.name} Deleted Succesfully!`);
                res.redirect('/admin/registeredUsers');
            })
            .catch((err)=>{
                console.log(err);
                req.flash("success","Delete Failed");
                res.redirect("/admin/registeredUsers");
            })
            console.log("Deleted");
        }   
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
    const driveRegex = /[-\w]{25,}/;
    const sheetRegex = /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/;
    req.body.driveFolderLink=req.body.driveFolderLink.match(driveRegex)[0];
    req.body.googleSheetLink=req.body.googleSheetLink.match(sheetRegex)[1];
    console.log(req.params,req.body);
    User.findByIdAndUpdate(req.params.id,{$set:req.body}).then(result=>{
        req.flash("success",`User ${result.email} Updated Successfully!`);
        res.redirect('/');
    }).catch(err=>res.send(err.message));
}