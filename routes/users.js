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

module.exports = router;