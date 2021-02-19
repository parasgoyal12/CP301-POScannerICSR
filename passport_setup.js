const GoogleStrategy = require("passport-google-oauth20").Strategy;
const keys = require('./config/keys');
const User = require('./models/users');

module.exports= passport =>{
    passport.serializeUser((user,done)=>{
        done(null,user.id);
    });
    passport.deserializeUser((id,done)=>{
        User.findById(id).then(user=>{
            done(null,user);
        });
    });
    passport.use(
        new GoogleStrategy(
            {
                clientID:keys.google.clientID,
                clientSecret:keys.google.clientSecret,
                callbackURL:"/auth/google/redirect"
            },
            (accessToken,refreshToken,profile,done) =>{
                // console.log(`access token ${accessToken}`);
                // console.log(profile);
                User.findOne({googleID: profile.id}).then(currentUser=>{
                    if(currentUser){
                        done(null,currentUser);
                    }else{
                        new User({
                            email: profile.emails[0].value,
                            googleID: profile.id,
                            name:profile.displayName
                        }).save().then(newUser=>{
                            done(null,newUser);
                        });
                    }

                });
            }
        )
    );
};