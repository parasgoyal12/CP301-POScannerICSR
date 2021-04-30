const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gemFormSchema = new Schema({
    User : {
        type : String,
        required : true
    },
    contractNo : {
        type : String,
    },
    gstin : {
        type : String,
    },
    GeMSellerId : {
        type : String,
    },
    datePrepared : {
        type : String,
    },
    fileNo : {
        type : String,
    },
    indenter : {
        type : String,
    },
    department : {
        type : String,
    },
    fundingAgency : {
        type : String,
    },
    projectName : {
        type : String,
    },
    itemName : {
        type : String,
    },
    indianImported : {
        type : String,
    },
    amount : {
        type : String,
    },
    importAmount : {
        type : String,
    },
    category : {
        type : String,
    },
    modeofPurchase : {
        type : String,
    },
    sanctionNumber : {
        type : String,
    },
    poDate : {
        type : String,
    },
    companyName : {
        type : String,
    },
    materialDescription : {
        type : String,
    },
    poAmount : {
        type : String,
    },
    remarks : {
        type : String,
    },
    fileName :{
        type : String
    }
});

const gemForm = mongoose.model('gemForm',gemFormSchema);
module.exports = gemForm;
