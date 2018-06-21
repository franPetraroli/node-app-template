const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')


//Load user model
const User = mongoose.model('user')

module.exports = function(passport){
  passport.use(new LocalStrategy({usernameField:'email'}, (email, password, done )=>{
    User.findOne({email:email}).then(user=>{
      if(!user){
        // console.log('not found');
        return done(null, false, {message:'No user found'})
      }else{
        //if password match        
        bcrypt.compare(password, user.password, (err, isMatch)=>{
          if(err) throw err;
          if(isMatch){            
            done(null, user)
          }else{
            done(null,false, {message:'Password Incorrect'})
          }
        })
      }
    })
  }))

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
}