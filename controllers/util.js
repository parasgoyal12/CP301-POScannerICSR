const {ImageAnnotatorClient} = require('@google-cloud/vision').v1;
const fs = require('fs').promises;
const client = new ImageAnnotatorClient();
let nodemailer = require('nodemailer');
var keys=require('./../config/keys');
const {google} = require('googleapis');
const fsasync = require('fs');
const path = require('path');
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

function parse(data) {
  let str = data.fullTextAnnotation.text;
  // let str = data.text;

  // Assumptions for rgx in comments, won't work without these

  
  const GSTINrgx = /GSTIN/i;
  let GST = str.match(GSTINrgx);
  if (GST == null) {
      // 
      // 
      // return
      return -1;
  }
  
  // xx.xx.xxxx format, First instance is always date (as in samples)
  const dateRgx = /\d{2}[.]\d{2}[.]\d{4}/;
  let date = str.match(dateRgx);
  if (date != null) {
      date = date[0];
  }

  // Total followed by Amt
  // sometimes rs symbol -> 3
  const amountRgx = /total[^\d]*[\d,.]*/gi; 
  let amount = str.match(amountRgx);
  if (amount != null) {
      amount = amount[amount.length - 1];
      amount = amount.substring(amount.match(/[\d]/).index, amount.length);
  }

  // PO number starts with digit and ??
  const PONoRgx = /po[" "]*no[^\d]*[\d-,/\w]*/i;
  let PO = str.match(PONoRgx);
  if (PO != null) {
      PO = PO[0];
      PO = PO.substring(PO.search(/[\d]/), PO.length);
  }

  // Supple of 'item'
  const itemRgx = /supply[" "]*of[^\w]*[\w" "\d-.,:]*[^'\n]/i;
  let item = str.match(itemRgx);
  if (item != null) {
      item = item[0];
      item = item.substring(item.match(/supply[" "]*of[^\w]*/i)[0].length, item.length);
  }

  // FOR : Deaprtment of .., (no comma in dept name & comma after dept name)
  const deptRgx = /for[" ":]*department of[" "]*[\w" "\d]*/i;
  let dept = str.match(deptRgx);
  if (dept != null) {
      dept = dept[0];
      dept = dept.substring(dept.match(/for[" ":]*department of[" "]*/i)[0].length, dept.length);
  }

  // M/s supplier
  const supRgx = /M\/s[^,\n]*/i;
  let supplier = str.match(supRgx);
  if (supplier != null) {
      supplier = supplier[0];
  }

  // CC to : indenter   
  const indRgx = /cc[" "]*to[" ":]*\n1.[" "\w.]*/i;
  let indenter = str.match(indRgx);
  if (indenter != null) {
      indenter = indenter[0];
      indenter = indenter.substring(indenter.match(/cc[" "]*to[" ":]*\n1.[" "]*/i)[0].length, indenter.length);
  }

  serialNo = PO.substring(0, PO.match('-').index);
  
  let info = {
      datePrepared: date.split(".").reverse().join("-"),
      poDate: date.split(".").reverse().join("-"),
      amount: amount.replace(",",""),
      poAmount: amount.replace(",",""),
      poNumber: PO,
      fileNo: PO,
      itemName: item,
      department: dept,
      supplier: supplier,
      indenter: indenter,
      serialNo: serialNo,
      indentNo: serialNo,
      materialDescription: item,
  };
  // console.log(info);
  return info;
}

function sendMail(formResponse, to) {
  let transporter = nodemailer.createTransport({
      service:'gmail',
      auth: {
          user: keys.test.id,
          pass: keys.test.password
      }
  });

  console.log(keys.test.id, keys.test.password)
  let mailOptions = {
      from: keys.test.id,
      to: to,
      subject: 'Successfully added PO',
      html: `<div><b>Following PO was added successfully:</b>`+
      `<ul><li><b>serialNo: </b>${formResponse.serialNo}</li></ul></div>`+
      `<ul><li><b>indentNo: </b>${formResponse.indentNo}</li></ul></div>`+
      `<ul><li><b>datePrepared: </b>${formResponse.datePrepared}</li></ul></div>`+
      `<ul><li><b>indenter: </b>${formResponse.indenter}</li></ul></div>`+
      `<ul><li><b>department: </b>${formResponse.department}</li></ul></div>`+
      `<ul><li><b>fundingAgency: </b>${formResponse.fundingAgency}</li></ul></div>`+
      `<ul><li><b>itemName: </b>${formResponse.itemName}</li></ul></div>`+
      `<ul><li><b>indianImported: </b>${formResponse.indianImported}</li></ul></div>`+
      `<ul><li><b>amount: </b>${formResponse.amount}</li></ul></div>`+
      `<ul><li><b>modeofPurchase: </b>${formResponse.modeofPurchase}</li></ul></div>`+
      `<ul><li><b>poNumber: </b>${formResponse.poNumber}</li></ul></div>`+
      `<ul><li><b>supplier: </b>${formResponse.supplier}</li></ul></div>`+
      `<ul><li><b>materialDescription: </b>${formResponse.materialDescription}</li></ul></div>`+
      `<ul><li><b>poAmount: </b>${formResponse.poAmount}</li></ul></div>`+
      `<ul><li><b>fileName: </b>${formResponse.fileName}</li></ul></div>`+
      `<ul><li><b>remarks: </b>${formResponse.remarks}</li></ul></div>`+
      `<ul><li><b>poAmount: </b>${formResponse.poAmount}</li></ul></div>`+
      `<ul><li><b>driveLink: </b>${formResponse.driveLink}</li></ul></div>`
  }
  transporter.sendMail(mailOptions, function(err, info){
      if (err) {
          console.log(mailOptions);
          console.log(err);
      }
  })
}

function saveToDrive(client,filename){
  const gsapi = google.drive({version : 'v3',auth : client});
  var folderId = keys.driveFolder;
  var fileMetadata = {
  'name': filename,
  parents: [folderId]
  };
  var media = {
  mimeType: 'application/pdf',
  body: fsasync.createReadStream(path.join(path.resolve(__dirname,'..'),'public/uploads',filename))
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
module.exports = {batchAnnotateFiles,parse,sendMail,saveToDrive};