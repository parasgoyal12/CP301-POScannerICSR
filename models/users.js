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

const tokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600*3,// this is the expiry time in seconds
  },
});
const Token = mongoose.model("Token", tokenSchema);
module.exports = {User,Token};