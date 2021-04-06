const mongoose = require("mongoose");
const { Passport } = require("passport");
const passportLocalMongoose = require('passport-local-mongoose');

const UsersScehma= new mongoose.Schema(
    {
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true
        },
        name:{
            type:String,
            required:true
        },
        isAdmin:{type:Boolean,default:false}
    }
);
UsersScehma.plugin(passportLocalMongoose,{usernameField:'email'});

const User = mongoose.model('User',UsersScehma);
module.exports = {User};