const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')


//Load user model
const User = mongoose.model('user')

module.exports = function(passport){
  passport.use(new LocalStrategy({usernameField:'email'}, (email, password, done )=>{
    User.findOne({email:email}).then(user=>{
      if(!user){
        console.log('not found');
        // return done(null, false, {error:'No user found'})
      }else{
        //if password match
        console.log('user found');
        
        bcrypt.compare(password, user.password, (err, isMatch)=>{
          if(err) throw err;
          if(isMatch){
            console.log('password match');
            
            done(null, user)
          }else{
            done(null,false, console.log('password dont march'))
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