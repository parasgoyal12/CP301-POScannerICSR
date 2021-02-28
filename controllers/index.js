let formidable = require('formidable');
let path = require('path');
const {google} = require('googleapis');
var keys=require('./../config/keys');
const { response } = require('express');
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
    const client = new google.auth.JWT(keys.google_sheet.client_email,null,keys.google_sheet.private_key,['https://www.googleapis.com/auth/spreadsheets']);
    client.authorize(function(err,tokens){
        if(err)
        {
            console.log(err);
        }
        else
        {
            console.log("connected");
        }
    });
    let formResponse = req.body;
    let resArr=Object.values(formResponse);
    console.log(resArr);
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
    // res.send(req.body);
    // Add Saving Logic Here
};