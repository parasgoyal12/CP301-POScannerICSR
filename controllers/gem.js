let formidable = require('formidable');
let nodemailer = require('nodemailer');
let path = require('path');
const {google} = require('googleapis');
var keys=require('./../config/keys');
const { response } = require('express');
const { batchAnnotateFiles,parse,sendMail,saveToDrive,getFinancialYear,getDriveFolder,getSheetTitle,pdfParser,gemPoParser} = require('./gemUtils');
const fs = require('fs');
var Form = require('./../models/gemForm');
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
        file.path=path.join(path.resolve(__dirname,'..'),'public/gemUploads',file.name);
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
                form.save().then(result=>{res.redirect(`/gem/gemConfirmationPage/${result._id}`);}).catch(err=>{res.send(err.message);});
            }
            else{
                pdfParser(filePath).then(resp =>{
                    formData=gemPoParser(resp);
                    console.log(formData);
                    formData.fileName = filename;
                    formData.User=req.user._id;
                    const form = new Form(formData);
                    form.save().then(result=>{res.redirect(`/gem/gemConfirmationPage/${result._id}`);}).catch(err=>{res.send(err.message);});
                }).catch(err=>{
                    console.log(err.message);
                    res.send(err);
                });
            }
        }
    });
};

exports.getGemConfirmationPage=(req,res,next)=>{
    Form.findById(req.params.id)
    .then(result=>{
        if(result)
        res.render('gem/gemConfirmationPage',{title:'Gem PO ConfirmationPage',user:req.user,formData:result});
        else next();
    })
    .catch(err=>{
        console.log(err);
        next();
    });
    // res.render('confirmationPage',{title:'ConfirmationPage',user:req.user});
};

exports.submitGemConfirmationPage= async (req,res,next)=>{
    const client = new google.auth.JWT(keys.google_sheet.client_email,null,keys.google_sheet.private_key,['https://www.googleapis.com/auth/spreadsheets','https://www.googleapis.com/auth/drive']);
    client.authorize(function(err,tokens){
        if(err)console.log(err);
    });
    let formResponse = req.body;
    console.log("BODY", req.body);
    formResponse.fileName = `${keys.clientUrl}/gemUploads/${formResponse.fileName}`;
    formResponse.user = req.user.name;
    delete formResponse.submit;
    try{
        console.log(req.user.googleSheetLink);
        let sheetTitle = await getSheetTitle(client,getFinancialYear(),req.user.googleSheetLink);
        let result = await Form.findByIdAndDelete(req.params.id);
        console.log(sheetTitle);
        let driveFolderID = await getDriveFolder(client,getFinancialYear(),req.user.driveFolderLink);
        console.log(driveFolderID);
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
        res.redirect("/gem");
    }
    catch(err){
        console.log(err);
        req.flash("success",`PO Addition Failed!`);
        res.redirect("/gem");
    }
};

exports.gemSavedPOPage = (req, res, next) => {
    Form.find({User: req.user._id})
        .then((result) => {
            res.render('gem/gemSavedPO', {pos:result, user:req.user, title:"GeM Saved PO Page", successFlash:req.flash("success")});
        })
        .catch((err) => {
            console.log(err);
        });
}


exports.continueLater = (req, res, next)=>{
    Form.findByIdAndUpdate(req.params.id, {$set:req.body})
        .then(result => {
            req.flash("success", `${result.contractNo} saved Succesfully! You can now edit it later.`);
            res.redirect('/gem/gemSavedPOPage');
        })
    .catch(err=>res.send(err.message));
};

exports.deleteSaved = (req, res, next) => {
    Form.findByIdAndDelete(req.params.id)
        .then(resp => {
            req.flash("success", `${resp.contractNo} Deleted Succesfully!`);
            fs.unlinkSync(path.join(path.resolve(__dirname,'..'), 'public/gemUploads',resp.fileName));
            res.redirect('/gem/gemSavedPOPage');
        })
        .catch((err)=>{
            console.log(err);
            req.flash("success", "Delete Failed");
            res.redirect("/gem/gemSavedPOPage");
        })
};