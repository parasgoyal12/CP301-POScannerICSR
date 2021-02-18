let formidable = require('formidable');
let path = require('path');
exports.home_page = (req,res,next)=>{
    res.render('index',{title:'Express'});
};

exports.getUploadPage = (req,res,next)=>{
    res.render('uploadPage',{title:"Upload Page"});
};

exports.submitUploadPage = (req,res,next)=>{
    var form = new formidable.IncomingForm();
    form.parse(req);
    form.on('fileBegin',function(name,file)
    {
        file.path=path.join(path.resolve(__dirname,'..'),'public/uploads',file.name);
    });	
    res.render("index",{title:"Express"});
};
