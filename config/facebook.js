const mongoose = require("mongoose")
require("../models/Dashboard")
const dashboardUser = mongoose.model("dashboard_users")
const FacebookStrategy = require("passport-facebook").Strategy;
const bcrypt = require("bcryptjs")


module.exports = function(passport){
    passport.use(new FacebookStrategy({
        clientID: "1395625417840949",
        clientSecret: "4d5cd0e84d31590973a61fac4f6b99f6",
        callbackURL: "http://localhost:3000/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'email']
      },
      async (accessToken, refreshToken, profile, done) => {
        const id = profile.id;
     const name = profile.displayName;

  const currentUser = await dashboardUser.findOne({ email:id })

  
  if (!currentUser) {
    // Genarate rendom passport for user who login with google 
    let password =  name + id;
        password = await bcrypt.hash(password, 10);

        const newUser = new dashboardUser({
            user: name,
                email:id,
                password,
                isLoggedin: 1
          
        });

        
          await newUser.save({ validateBeforeSave: false });
          return done(null, newUser)
  }


  return done(null, currentUser)



      }
    ));

    passport.serializeUser((dashboard_users, done) => {
        done(null, dashboard_users)
    })

    passport.deserializeUser((id, done) => {
        dashboardUser.findById(id, (err, dashboard_users) => {
            done(err, dashboard_users)
        })
    })

}