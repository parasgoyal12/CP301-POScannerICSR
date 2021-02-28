const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const formSchema = new Schema({
    User : {
        type : String,
        required : true
    },
    serialNo : {
        type : Number,
    },
    indentNo : {
        type : Number,
    },
    datePrepared : {
        type : String,
    },
    fileNo : {
        type : Number,
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
        type : Number,
    },
    importAmount : {
        type : Number,
    },
    category : {
        type : String,
    },
    modeofPurchase : {
        type : String,
    },
    poNumber : {
        type : Number,
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
        type : Number,
    },
    remarks : {
        type : String,
    }
});

const Form = mongoose.model('form',formSchema);
module.exports = Form;
