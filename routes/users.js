const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport')

//Look for Idea model
require('../models/User');
const User = mongoose.model('user')

//Login routes
router.get('/login', (req, res) => {
  res.render('users/login')
})

//Register route
router.get('/register', (req, res) => {
  res.render('users/register')
})

router.post('/register', (req, res) => {
  let errors = []
  if (req.body.password != req.body.password2) {
    errors.push({
      text: 'password does not match'
    })
  }
  if (req.body.password.length < 4) {
    errors.push({
      text: 'password too short, min 4 char'
    })
  }
  if (errors.length > 0) {
    res.render('users/register', {
      errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2,
    })

  } else {
    User.findOne({
      email: req.body.email
    }).then(user => {
      if (user) {
        errors.push({
          text: 'Email already in use'
        })
        res.redirect('/users/register')
      } else {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        })

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err
            newUser.password = hash
            newUser.save().then(user => {
              console.log('success');
              res.redirect('/users/login')
            })
          })
        })
      }
    })
  }
})

module.exports = router;