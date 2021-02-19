let formidable = require('formidable');
let path = require('path');
exports.home_page = (req,res,next)=>{
    res.render('index',{title:'Home',user:req.user});
};

exports.getUploadPage = (req,res,next)=>{
    res.render('uploadPage',{title:"Upload Page",user:req.user});
};

exports.submitUploadPage = (req,res,next)=>{
    var form = new formidable.IncomingForm();
    form.parse(req);
    form.on('fileBegin',function(name,file)
    {
        file.path=path.join(path.resolve(__dirname,'..'),'public/uploads',file.name);
    });	
    res.render("index",{title:"Home",user:req.user});
};

exports.getConfirmationPage=(req,res,next)=>{
    res.render('confirmationPage',{title:'ConfirmationPage',user:req.user});
};

exports.submitConfirmationPage=(req,res,next)=>{

    res.send(req.body);
    // Add Sheets API logic here
};