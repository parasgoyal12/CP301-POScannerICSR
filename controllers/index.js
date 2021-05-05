let formidable = require('formidable');
let nodemailer = require('nodemailer');
let path = require('path');
const {google} = require('googleapis');
var keys=require('./../config/keys');
const { response } = require('express');
const { batchAnnotateFiles,parse,sendMail,saveToDrive,getFinancialYear,getDriveFolder,getSheetTitle } = require('./util');
const fs = require('fs');
var Form = require('./../models/form');

exports.home_page = (req,res,next)=>{

    res.render('index',{title:'Home',user:req.user,successFlash:req.flash("success")});
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
    let docText=null;
    form.on('aborted',()=>{
        isError=true;
        res.status(413).send("File Already Exists!");
    });	
    form.on('fileBegin',function(name,file)
    {
        file.path=path.join(path.resolve(__dirname,'..'),'public/uploads',file.name);
        filename=file.name;
        filePath=file.path;
        // console.log(file);
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
                batchAnnotateFiles(filePath).then(resp=>{
                    formData=parse(resp.fullTextAnnotation.text);
                    // formData.pdfLink="/uploads/"+filename;
                    formData.fileName = filename;
                    formData.User=req.user._id;
                    const form = new Form(formData);
                    form.save().then(result=>{res.redirect(`/confirmationPage/${result._id}`);}).catch(err=>{res.send(err.message);});
                    // res.render("confirmationPage",{title:"ConfirmationPage",user:req.user,formData});
                }).catch(err=>{
                    console.log(err.message);
                    res.send(err);
                });
            }
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

exports.submitConfirmationPage= async (req,res,next)=>{
    const client = new google.auth.JWT(keys.google_sheet.client_email,null,keys.google_sheet.private_key,['https://www.googleapis.com/auth/spreadsheets','https://www.googleapis.com/auth/drive']);
    client.authorize(function(err,tokens){
        if(err)console.log(err);
    });
    let formResponse = req.body;
    // console.log(req.body);
    // formResponse.fname = formResponse.fileName;
    formResponse.link = `${keys.clientUrl}/uploads/${formResponse.fileName}`;
    formResponse.user = req.user.name;
    delete formResponse.submit;
    try{
        
        let sheetTitle = await getSheetTitle(client,getFinancialYear(formResponse.poDate),req.user.googleSheetLink);
        let result = await Form.findByIdAndDelete(req.params.id);
        
        let driveFolderID = await getDriveFolder(client,getFinancialYear(formResponse.poDate),req.user.driveFolderLink);
        req.flash("success",`PO ${result.poNumber} Added Succesfully!`);
        result = await saveToDrive(client,result.fileName,driveFolderID);
        
        formResponse.driveLink="https://drive.google.com/file/d/"+result.data.id;
        if(formResponse.sendEmail==="1"){
            sendMail(formResponse, req.user.email);
            delete formResponse.sendEmail;
        }
        let resArr=Object.values(formResponse);
        const gsapi = google.sheets({version : 'v4',auth : client});
        const options = {
            spreadsheetId : req.user.googleSheetLink,
            range : `'${sheetTitle}'!A1`,
            valueInputOption : 'USER_ENTERED',
            resource : {values : [resArr]}
        }
        await gsapi.spreadsheets.values.append(options);
        res.redirect("/");
    }
    catch(err){
        console.log(err);
        req.flash("success",`PO Addition Failed!`);
        res.redirect("/");
    }
};

exports.continueLater = (req,res,next)=>{
    Form.findByIdAndUpdate(req.params.id,{$set:req.body})
    .then(result=>{
        req.flash("success",`PO ${result.poNumber} saved Succesfully! You can now edit it later.`);
        res.redirect('/savedPOPage');
    })
    .catch(err=>res.send(err.message));
};

exports.savedPOPage = (req,res,next)=>{
    Form.find(
        {
            User : req.user._id
        }
    ).then((result) => {
        res.render('savedPo',{pos:result,user:req.user,title:"Saved PO Page",successFlash:req.flash("success")});
    })
    .catch((err) => {
        console.log(err)
    });
};

exports.getHelpPage = (req,res,next)=>{
    res.render('helpPage',{title:'Help',user:req.user,successFlash:req.flash("success")});
};

exports.getBatchUpload = (req,res,next)=>{
    res.render('batchUpload',{title:'Batch Upload',user:req.user});
};

exports.postBatchUpload = (req,res,next)=>{
    var form = new formidable.IncomingForm();
    form.parse(req);
    let filename='';
    let filePath='';
    let isError = false;
    form.on('aborted',()=>{
        isError=true;
        
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
                    formData=parse(resp.fullTextAnnotation.text);
                    // formData.pdfLink="/uploads/"+filename;
                    formData.fileName = filename;
                    formData.User=req.user._id;
                    const form = new Form(formData);
                    form.save().then(result=>{res.send({message:"File Uploaded Succesfully"});}).catch(err=>{res.send(err.message);});
                    // res.render("confirmationPage",{title:"ConfirmationPage",user:req.user,formData});
                }).catch(err=>{
                    console.log(err.message);
                    res.send(err);
                });
            }
            else res.status(413).send("File Already Exists!");
    });
};

exports.deleteSaved = (req,res,next)=>{
    Form.findByIdAndDelete(req.params.id)
    .then(resp=>{
        // console.log(resp);
        req.flash("success",`${resp.fileNo} Deleted Succesfully!`);
        fs.unlinkSync(path.join(path.resolve(__dirname,'..'),'public/uploads',resp.fileName));
        res.redirect('/savedPOPage');
    })
    .catch((err)=>{
        console.log(err);
        req.flash("success","Delete Failed");
        res.redirect("/savedPOPage");
    })
};