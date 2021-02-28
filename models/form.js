const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const formSchema = new Schema({
    User : {
        type : String,
        required : true
    },
    serialNo : {
        type : String,
    },
    indentNo : {
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
    poNumber : {
        type : String,
    },
    poDate : {
        type : String,
    },
    supplier : {
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
    }
});

const Form = mongoose.model('form',formSchema);
module.exports = Form;
