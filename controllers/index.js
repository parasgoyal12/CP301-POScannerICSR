let formidable = require('formidable');
let path = require('path');
const {google} = require('googleapis');
var keys=require('./../config/keys');
keys = keys.googleSheet;
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

    // Add Sheets API logic here
    const client = new google.auth.JWT(
        keys.client_email,
        null,
        keys.private_key,
        ['https://www.googleapis.com/auth/spreadsheets']
        );
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
        let resArr=[]
        for (var i in formResponse)
        {
            resArr.push([i, formResponse[i]]);
        }
        console.log(resArr);
        async function gApiRun(client){
            const gsapi = google.sheets({version : 'v4',auth : client});
            const options = {
                spreadsheetId : '14iSnufwf8Kppir7LWZIq9YMXSOYSAZv6-ObjQQfMOfU',
                range : 'Sheet1!A1:B20',
                valueInputOption : 'USER_ENTERED',
                resource : {values : resArr}
            }
        await gsapi.spreadsheets.values.update(options);
        }
        let x = gApiRun(client);
        console.log(x);
        res.send(req.body);
};