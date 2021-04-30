const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gemFormSchema = new Schema({
    User : {            //done
        type : String,
        required : true
    },
    contractNo : {      //done
        type : String,
    },
    gstin : {           //done
        type : String,
    },
    GeMSellerId : {     //done
        type : String,
    },
    datePrepared : {    //done
        type : String,
    },
    department : {      //done
        type : String,
    },
    fundingAgency : {   //done
        type : String,
    },
    projectName : {     //done
        type : String,
    },
    itemName : {        //done
        type : String,
    },
    indianImported : {  //done
        type : String,
    },
    amount : {          //done
        type : String,
    },
    importAmount : {    //done
        type : String,
    },
    category : {        //done
        type : String,
    },
    modeofPurchase : {  //done
        type : String,
    },
    sanctionNumber : {  //done
        type : String,
    },
    poDate : {          //done
        type : String,
    },
    companyName : {     //done
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
