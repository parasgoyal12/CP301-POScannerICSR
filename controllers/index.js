let formidable = require('formidable');
let path = require('path');
const {google} = require('googleapis');
var keys=require('./../config/keys');
const { response } = require('express');
const { batchAnnotateFiles,parse } = require('./util');
const fs = require('fs');
var Form = require('./../models/form');
exports.home_page = (req,res,next)=>{
    res.render('index',{title:'Home',user:req.user});
};

exports.getUploadPage = (req,res,next)=>{
    res.render('uploadPage',{title:"Upload Page",user:req.user});
};

exports.submitUploadPage = (req,res,next)=>{
    var form = new formidable.IncomingForm();
    form.parse(req);
    let filename='';
    let filePath='';
    let isError = false;
    form.on('aborted',()=>{
        isError=true;
        res.status(413).send("File Already Exists!");
    });	
    form.on('fileBegin',function(name,file)
    {
        file.path=path.join(path.resolve(__dirname,'..'),'public/uploads',file.name);
        filename=file.name;
        filePath=file.path;
        if(fs.existsSync(filePath)){
            this.emit('aborted')
        }
    });
        
    form.on('end',()=>{
        if(!isError){
            batchAnnotateFiles(filePath).then(resp=>{
                formData=parse(resp);
                // formData.pdfLink="/uploads/"+filename;
                formData.fileName = filename;
                formData.User=req.user._id;
                const form = new Form(formData);
                form.save().then(result=>{res.redirect(`/confirmationPage/${result._id}`);}).catch(err=>{res.send(err.message);});
                // res.render("confirmationPage",{title:"ConfirmationPage",user:req.user,formData});
            }).catch(err=>{
                console.log(err.message);
                res.send(err);
            })
        }
    });
};

exports.getConfirmationPage=(req,res,next)=>{
    Form.findById(req.params.id)
    .then(result=>{
        if(result)
        res.render('confirmationPage',{title:'ConfirmationPage',user:req.user,formData:result});
        else next();
    })
    .catch(err=>{
        console.log(err);
        next();
    });
    // res.render('confirmationPage',{title:'ConfirmationPage',user:req.user});
};

exports.submitConfirmationPage=(req,res,next)=>{
    const client = new google.auth.JWT(keys.google_sheet.client_email,null,keys.google_sheet.private_key,['https://www.googleapis.com/auth/spreadsheets']);
    client.authorize(function(err,tokens){
        if(err)console.log(err);
    });
    let formResponse = req.body;
    // console.log(req.body);
    formResponse.fileName = `http://localhost:3000/uploads/${formResponse.fileName}`;
    formResponse.user = req.user.name;
    delete formResponse.submit;
    let resArr=Object.values(formResponse);
    async function gApiRun(client){
        const gsapi = google.sheets({version : 'v4',auth : client});
        const options = {
            spreadsheetId : keys.google_sheet.sheetID,
            range : 'Sheet1!A1',
            valueInputOption : 'USER_ENTERED',
            resource : {values : [resArr]}
        }
        await gsapi.spreadsheets.values.append(options);
    }
    gApiRun(client).then(result=>{
        console.log(result);
        return Form.findByIdAndDelete(req.params.id);
    })
    .then(result=>res.send("Success"))
    .catch(err=>{
        console.log(err);
        res.send("Failed");
    });
};

exports.continueLater = (req,res,next)=>{
    Form.findByIdAndUpdate(req.params.id,{$set:req.body}).then(result=>res.send(result)).catch(err=>res.send(err.message));
};

exports.savedPOPage = (req,res,next)=>{
    Form.find(
        {
            User : req.user._id
        }
    ).then((result) => {
        res.render('savedPo',{pos:result,user:req.user,title:"Saved PO Page"});
    })
    .catch((err) => {
        console.log(err)
    });
};