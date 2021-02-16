let formidable = require('formidable');
let path = require('path');
exports.home_page = (req,res,next)=>{
    res.render('index',{title:'Express'});
};

exports.getUploadPage = (req,res,next)=>{
    res.render('uploadPage',{title:"Upload Page"});
};

exports.submitUploadPage = (req,res,next)=>{
    new formidable.IncomingForm().parse(req)
    .on('fileBegin', (name, file) => {
        file.path = path.join(path.resolve(__dirname,'..'),'public/uploads/',file.name);
    })
    .on('file', (name, file) => {
      console.log('Uploaded file', name, file)
    })
    res.redirect('/');
};