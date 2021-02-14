const mongoose = require("mongoose");

const UsersScehma= new mongoose.Schema(
    {
        googleID:{
            type: String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        name:{
            type:String,
            required:true
        }
    }
);

const User = mongoose.model('User',UsersScehma);
module.exports = User;