const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


//Login routes
router.get('/login', (req, res)=>{
  res.render('users/login')
})

//Register route
router.get('/register', (req, res)=>{
  res.render('users/register')
})

router.post('/register', (req, res)=>{
  let error = []
  if(req.body.password != req.body.password2){
    error.push({text: 'password does not match'})
  }
  if(req.body.password.length < 4){
    error.push({text: 'password too short, min 4 char'})
  }
  if(error.length > 0){
    res.render('/users/register', {
      errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passowrd2: req.body.passowrd2
    })
  }else{
    res.send('passed')
  }
})

module.exports = router;