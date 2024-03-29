const {ImageAnnotatorClient} = require('@google-cloud/vision').v1;
const fs = require('fs').promises;
const client = new ImageAnnotatorClient();
let nodemailer = require('nodemailer');
var keys=require('./../config/keys');
const {google} = require('googleapis');
const fsasync = require('fs');
const path = require('path');
const convertRupeesIntoWords = require('convert-rupees-into-words');
const pdf = require('pdf-parse');

async function batchAnnotateFiles(fileName) {
  const inputConfig = {
    mimeType: 'application/pdf',
    content: await fs.readFile(fileName),
  };

  const features = [{type: 'DOCUMENT_TEXT_DETECTION'}];


  const fileRequest = {
    inputConfig: inputConfig,
    features: features,
    pages: [-3],
  };

  // Add each `AnnotateFileRequest` object to the batch request.
  const request = {
    requests: [fileRequest],
  };

  // Make the synchronous batch request.
  const [result] = await client.batchAnnotateFiles(request);

  // Process the results, just get the first result, since only one file was sent in this
  // sample.
  const responses = result.responses[0].responses;

//   for (const response of responses) {
//     console.log(`Full text: ${response.fullTextAnnotation.text}`);
//   }
  return responses[0];
}
function gemPoParser(data){
    let str = data;
    

    let info = {
      contractNo : "",        // or PO number
      gstin : "",
      GeMSellerId : "",
      department : "",
      fundingAgency : "",
      projectName : "",
      itemName : "",
      indianImported : "",
      amount : "",
      category : "",
      modeofPurchase : "",
      sanctionNumber : "",
      sanctionDate : "",
      companyName : "",
      materialDescription : "",
      poAmount : "",
      indenter : "",
      date : ""
    };
  const GSTINrgx = /GSTIN[^\d]*[\dA-Z]*/i;
  let GST = str.match(GSTINrgx);
  if (GST == null) {
      return {};
  } else {
      GST = GST[0];
      info.gstin = GST.substring(GST.match(/:/).index + 1, GST.length).trim();
  }

  const ord_val = /Total Order Value \(in INR\)[^\d]*[\d,.]*/i;
  let amount = str.match(ord_val);
  if (amount != null) {
      amount = amount[0];
      amount = amount.substring(amount.match(/[\d]/).index, amount.length).trim();;
      info.amount = "";
      for (let i = 0 ; i < amount.length ; i++) {
        if (amount[i] != ',') {
          info.amount += amount[i];
        }
      }
  }

  const gem_seller = /GeM Seller ID[^\d]*[\dA-Z]*/;
  let GeMSellerId = str.match(gem_seller);
  if (GeMSellerId != null) {
      GeMSellerId = GeMSellerId[0];
      info.GeMSellerId = GeMSellerId.substring(GeMSellerId.match(/:/).index + 1, GeMSellerId.length).trim();
  }

  const company = /Company Name:*[a-zA-Z \t\d]*/;
  let companyName = str.match(company);
  if (companyName != null) {
      companyName = companyName[0];
      info.companyName = companyName.substring(companyName.match(/:/).index + 1, companyName.length).trim();
  }
  console.log(amount, companyName, GST, GeMSellerId)

  const sanction = /Sanction No[^\d]*[\d]*/i;
  let sanctionNumber = str.match(sanction);
  if (sanctionNumber != null) {
      sanctionNumber = sanctionNumber[0];
      info.sanctionNumber = sanctionNumber.substring(sanctionNumber.match(/[\d]/).index, sanctionNumber.length).trim();
  }   
  let buyer = /office[ \t]*name/i;//*name[^a-z^A-Z][\w]*/i;
  let first = str.match(buyer).index;
  let copy_str = str.substring(first + 10, str.length);
  buyer = /name[^a-z^A-Z][\w \t]*/i;
  let indenter = copy_str.match(buyer);
  if (indenter != null) {
      indenter = indenter[0];
      info.indenter = indenter.substring(indenter.match(/name[^a-z^A-Z]/i)[0].length, indenter.length).trim();
  }

  let sanctionDate = /sanction[ \t]*date[^\n]*/i;
  let date = str.match(sanctionDate);
  if (date != null) {
      date = date[0];
      date = date.substring(date.match(/:/).index + 1, date.length);
      date = date.replace("Jan", "01");
      date = date.replace("Feb", "02");
      date = date.replace("Mar", "03");
      date = date.replace("Apr", "04");
      date = date.replace("May", "05");
      date = date.replace("Jun", "06");
      date = date.replace("Jul", "07");
      date = date.replace("Aug", "08");
      date = date.replace("Sep", "09");
      date = date.replace("Oct", "10");
      date = date.replace("Nov", "11");
      date = date.replace("Dec", "12");
      date = date.trim();
      let f = date.match("-").index;
      if (f == 1) {
        date = "0" + date;
      }
      date = date.split("-").reverse().join("-");
      // console.log(date);
      info.sanctionDate = date.trim();
  }
  let payment = /payment[ \t]*mode[^\n]*/i;
  let paymentMode = str.match(payment);
  if (paymentMode != null) {
      paymentMode = paymentMode[0];
      info.modeofPurchase = paymentMode.substring(paymentMode.match(/:/).index + 1, paymentMode.length).trim();
  }

  let contract = /GEMC-[\d]*/;
  let contractNumber = str.match(contract);
  if (contractNumber != null) {
      info.contractNo = contractNumber[0].trim();
  }
  info.date = info.sanctionDate;
  info.poAmount = info.amount;
  // console.log(info.amount, info.companyName, info.gstin, info.GeMSellerId, info.sanctionNumber, info.indenter, info.sanctionDate, info.modeofPurchase, info.contractNo)
  // console.log(info);
  return info;
}

async function pdfParser(filePath){
  console.log(filePath);
  let pdfText = "";
  dataRead = await fs.readFile(filePath);
  await pdf(dataRead).then((data)=> {
      // console.log(data.text); 
      pdfText=data.text;
    });
    return pdfText;
}


function sendMail(formResponse, to) {
  let transporter = nodemailer.createTransport({
      service:'gmail',
      auth: {
          user: keys.test.id,
          pass: keys.test.password
      }
  });
  let mailOptions = {
      from: keys.test.id,
      to: to,
      subject: 'Successfully added PO',
      html: `<div><b>Following PO was added successfully:</b>`+
      `<ul><li><b>ContractNo: </b>${formResponse.contractNo}</li></ul></div>`+
      `<ul><li><b>indenter: </b>${formResponse.indenter}</li></ul></div>`+
      `<ul><li><b>GSTIN: </b>${formResponse.gstin}</li></ul></div>`+
      `<ul><li><b>GeMSellerId: </b>${formResponse.GeMSellerId}</li></ul></div>`+
      `<ul><li><b>date: </b>${formResponse.date}</li></ul></div>`+
      `<ul><li><b>department: </b>${formResponse.department}</li></ul></div>`+
      `<ul><li><b>itemName: </b>${formResponse.itemName}</li></ul></div>`+
      `<ul><li><b>fundingAgency: </b>${formResponse.fundingAgency}</li></ul></div>`+
      `<ul><li><b>projectName: </b>${formResponse.projectName}</li></ul></div>`+
      `<ul><li><b>indian/Imported: </b>${formResponse.indianImported}</li></ul></div>`+
      `<ul><li><b>amount: </b>${formResponse.amount}</li></ul></div>`+
      `<ul><li><b>importAmount: </b>${formResponse.importAmount}</li></ul></div>`+
      `<ul><li><b>category: </b>${formResponse.category}</li></ul></div>`+
      `<ul><li><b>modeofPurchase: </b>${formResponse.modeofPurchase}</li></ul></div>`+
      `<ul><li><b>sanctionNumber: </b>${formResponse.sanctionNumber}</li></ul></div>`+
      `<ul><li><b>sanctionDate: </b>${formResponse.sanctionDate}</li></ul></div>`+
      `<ul><li><b>companyName: </b>${formResponse.companyName}</li></ul></div>`+
      `<ul><li><b>driveLink: </b>${formResponse.driveLink}</li></ul></div>`
  }
  transporter.sendMail(mailOptions, function(err, info){
      if (err) {
          console.log(mailOptions);
          console.log(err);
      }
  })
}

function saveToDrive(client,filename,folderId){
  const gsapi = google.drive({version : 'v3',auth : client});
  // var folderId = keys.driveFolder;
  var fileMetadata = {
  'name': filename,
  parents: [folderId]
  };
  var media = {
  mimeType: 'application/pdf',
  body: fsasync.createReadStream(path.join(path.resolve(__dirname,'..'),'public/gemUploads',filename))
  };
  return new Promise(function(resolve,reject){
    gsapi.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id'
      }, function (err, file) {
        if (err) {
          reject(err)
        } else {
          resolve(file);
        }
      });
  });
}

function sendRegistrationDetails(formResponse, to){
  let transporter = nodemailer.createTransport({
    service:'gmail',
    auth: {
        user: keys.test.id,
        pass: keys.test.password
    }
  });
  let mailOptions = {
      from: keys.test.id,
      to: to,
      subject: 'Successfully Registed on PO upload Portal',
      html: `<div><b>Please use the following credentials to log In </b>`+
      `<ul><li><b>Email: </b>${formResponse.email}</li></ul></div>`+
      `<ul><li><b>Password: </b>${formResponse.password}</li></ul></div>`+
      `<br> It is Strongly Recommended to change your password Immediately.`
  };
  transporter.sendMail(mailOptions, function(err, info){
      if (err) {
          // console.log(mailOptions);
          console.log(err);
      }
  });
}

function sendResetToken(formResponse, to){
  let transporter = nodemailer.createTransport({
    service:'gmail',
    auth: {
        user: keys.test.id,
        pass: keys.test.password
    }
  });
  let mailOptions = {
      from: keys.test.id,
      to: to,
      subject: 'Password Reset Request Received',
      html: `<div><b>Please use the below link to reset your password </b>`+
      `<ul><li><b>Link: </b>${formResponse}</li></ul></div>`+
      `<br> This link expires in 3 hours.`
  };
  transporter.sendMail(mailOptions, function(err, info){
      if (err) {
          // console.log(mailOptions);
          console.log(err);
      }
  });
}

function getFinancialYear(date) {
  var fiscalyear = "";
  var today = new Date(date);
  console.log(today);
  if ((today.getMonth() + 1) <= 3) {
    fiscalyear = (today.getFullYear() - 1) + "-" + today.getFullYear()
  } else {
    fiscalyear = today.getFullYear() + "-" + (today.getFullYear() + 1)
  }
  return fiscalyear+"(GeM)";
}

async function getDriveFolder(client,financialYear,folderID){
  const gsapi = google.drive({version : 'v3',auth : client});
  // let folderID = keys.driveFolder;
  let files = await new Promise(function(resolve,reject){
    gsapi.files.list({
      q: `mimeType='application/vnd.google-apps.folder' and name='${financialYear}' and parents in '${folderID}'`,
        fields: 'files(id,name)',
        
      }, function (err, file) {
        if (err) {
          reject(err)
        } else {
          resolve(file);
        }
      });
  });
  // return files.data.files;
  if(files.data.files.length){
    return files.data.files[0].id;
  }
  else{
    console.log("Folder not found!");
    var fileMetadata = {
      'name': financialYear,
      'mimeType': 'application/vnd.google-apps.folder',
      parents:[folderID]
    };
    return await new Promise(function(resolve,reject){
      gsapi.files.create({
        resource: fileMetadata,
        fields: 'id'
      }, function (err, file) {
        if (err) {
          // Handle error
          console.error(err);
        } else {
          // console.log(file);
          resolve(file.data.id);
        }
      });
    });
  }
}
async function getSheetTitle(client,financialYear,sheetID){
  const gsapi = google.sheets({version : 'v4',auth : client});
  // let folderID = keys.driveFolder;
  const request = {
    spreadsheetId: sheetID,
    includeGridData:false
  };
  let sheets = await gsapi.spreadsheets.get(request);
  let titles = sheets.data.sheets.map(ele=>ele.properties.title);
  if(titles.includes(financialYear)){
    return financialYear;
  }else{
    console.log("Sheet Not Found");
    let response = await gsapi.spreadsheets.batchUpdate ({ 
      spreadsheetId: sheetID, 
      resource: {requests: [ {addSheet: {properties: {title: financialYear }}}]}});
    // console.log(response);
    return financialYear;
  }
}
module.exports = {batchAnnotateFiles,sendMail,saveToDrive,sendRegistrationDetails,sendResetToken,getFinancialYear,getDriveFolder,getSheetTitle,pdfParser,gemPoParser};