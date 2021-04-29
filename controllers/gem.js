let formidable = require('formidable');
let nodemailer = require('nodemailer');
let path = require('path');
const {google} = require('googleapis');
var keys=require('./../config/keys');
const { response } = require('express');
const { batchAnnotateFiles,parse,sendMail,saveToDrive,getFinancialYear,getDriveFolder,getSheetTitle,pdfParser,gemPoParser} = require('./util');
const fs = require('fs');
var Form = require('./../models/form');
let util = require('util');
// const pdfParserAsync = util.promisify(pdfParser);

exports.home = (req,res,next)=>{
    res.render('gem/index',{title:'GEM Home',user:req.user,successFlash:req.flash("success")});
};

exports.uploadPage =(req,res,next)=>{
    res.render('gem/uploadPage',{title:'GEM PO Upload',user:req.user});
}

exports.submitGemUploadPage = (req,res,next)=>{
    var form = new formidable.IncomingForm();
    form.parse(req);
    let filename='';
    let filePath='';
    let isError = false;
    let docText=null;
    form.on('aborted',()=>{
        isError=true;
        res.status(413).send("File Already Exists!");
    });	
    form.on('fileBegin',function(name,file)
    {
        file.path=path.join(path.resolve(__dirname,'..'),'public/uploads/gemUploads',file.name);
        filename=file.name;
        // console.log(filename);
        filePath=file.path;
        if(fs.existsSync(filePath)){
            this.emit('aborted')
        }
    });
    form.on('field', (fieldName, fieldValue) => {
        if(fieldName==="docText"){
            docText=fieldValue;
        }
    });
    form.on('end',()=>{
        if(!isError){
            if(docText){
                formData=parse(docText);
                formData.fileName=filename;
                formData.User=req.user._id;
                const form=new Form(formData);
                form.save().then(result=>{res.redirect(`/confirmationPage/${result._id}`);}).catch(err=>{res.send(err.message);});
            }
            else{
                pdfParser(filePath).then(resp =>{
                    formData=gemPoParser(resp);
                    formData.fileName = filename;
                    formData.User=req.user._id;
                    const form = new Form(formData);
                    form.save().then(result=>{res.redirect(`/confirmationPage/${result._id}`);}).catch(err=>{res.send(err.message);});
                }).catch(err=>{
                    console.log(err.message);
                    res.send(err);
                });
            }
        }
    });
};
