const mongoose = require("mongoose")
require("../models/Dashboard")
const dashboardUser = mongoose.model("dashboard_users")
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcryptjs")


module.exports = function(passport){
    passport.use(
        new GoogleStrategy(
          {
            callbackURL: "http://localhost:3000/auth/google/callback",
            clientID: "712436712661-30u7202hbifj8ae7s0pfl20br4u75rk2.apps.googleusercontent.com",
            clientSecret: "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",
          },
          async (accessToken, refreshToken, profile, done) => {
            const id = profile.id;
        
           const email = profile.emails[0].value;
         const name = profile.name.displayName;
 
      const currentUser = await dashboardUser.findOne({ email })

      
      if (!currentUser) {
        // Genarate rendom passport for user who login with google 
        let password = email + id;
            password = await bcrypt.hash(password, 10);
  
            const newUser = new dashboardUser({
                user: name,
                    email,
                    password,
                    isLoggedin: 1
              
            });
  
            
              await newUser.save({ validateBeforeSave: false });
              return done(null, newUser)
      }


      return done(null, currentUser)



          }
        )
      );


      passport.serializeUser((user, done) => {
        done(null, user.id);
      });
      
      passport.deserializeUser(async (id, done) => {
        const currentUser = await User.findOne({ id });
        done(null, currentUser);
      });
}