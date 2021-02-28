let formidable = require('formidable');
let path = require('path');
const {google} = require('googleapis');
var keys=require('./../config/keys');
const { response } = require('express');
const { batchAnnotateFiles,parse } = require('./util');

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
    form.on('fileBegin',function(name,file)
    {
        file.path=path.join(path.resolve(__dirname,'..'),'public/uploads',file.name);
        filename=file.name;
        filePath=file.path;
    });	    
    form.on('end',()=>{
        batchAnnotateFiles(filePath).then(resp=>{
            formData=parse(resp);
            formData.pdfLink="/uploads/"+filename;
            res.render("confirmationPage",{title:"ConfirmationPage",user:req.user,formData});
        }).catch(err=>{
            console.log(err.message);
            res.send(err);
        })
    });
};

exports.getConfirmationPage=(req,res,next)=>{
//     let obj ={
//     User : "",
//     serialNo : "",
//     indentNo : "",
//     datePrepared : "",
//     fileNo : "",
//     indenter : "",
//     department : "",
//     fundingAgency : "",
//     projectName : "",
//     itemName : "",
//     indianImported : "",
//     amount : "",
//     importAmount : "",
//     category : "",
//     modeofPurchase : "",
//     poNumber : "",
//     poDate : "",
//     supplier : "",
//     materialDescription : "",
//     poAmount : "",
//     remarks : ""
// }
    res.render('confirmationPage',{title:'ConfirmationPage',user:req.user});
};

exports.submitConfirmationPage=(req,res,next)=>{
    const client = new google.auth.JWT(keys.google_sheet.client_email,null,keys.google_sheet.private_key,['https://www.googleapis.com/auth/spreadsheets']);
    client.authorize(function(err,tokens){
        if(err)console.log(err);
    });
    let formResponse = req.body;
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
        res.send("Success")
    }).catch(err=>{
        console.log(err);
        res.send("Failed");
    });
};

exports.continueLater = (req,res,next)=>{
    let obj = req.body;
    obj.User = req.user._id;
    const form = new Form(
        obj
    )
    form.save()
        .then((result)=>{
            res.send(result)
        })
        .catch((err)=>{
            console.log(err)
        });
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