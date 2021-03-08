// const { gmail } = require("googleapis/build/src/apis/gmail");
let nodemailer = require('nodemailer');
var keys=require('./../config/keys');

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

module.exports = {
    sendMail: sendMail
}