const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ensureAuthenticated } = require('../helpers/auth')

//Looke for Idea model
require('../models/Idea');
const Idea = mongoose.model('ideas')

//Idea get handler
router.get('/', ensureAuthenticated,(req, res) => {
  Idea.find({user: req.user.id})
      .sort({date:'desc'})
      .then(ideas =>{
    res.render('ideas/index',{
      ideas
    })
  })
})

//Handle ideas/add route
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('ideas/add')
})


router.get('/edit/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea =>{
    if(req.user === undefined || idea.user != req.user.id){
      req.flash('error_msg', 'Not Authorized')
      res.redirect('/ideas')
    }else{
      res.render('ideas/edit', {
        idea
      })
    }
  })
  
})

router.put('/:id', ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea =>{
    idea.title = req.body.title,
    idea.details = req.body.details 

    idea.save().then(idea =>{
      res.redirect('/ideas')
    })
  });
})

router.delete('/:id', ensureAuthenticated,(req, res) => {  
  Idea.remove({_id: req.params.id}).then(()=>{
    req.flash('success_msg', 'Idea Removed')
    res.redirect('/ideas')
  })
})

//Process form idea
router.post('/', ensureAuthenticated, (req, res) => {
  let errors = [];
  if(!req.body.title){
    errors.push({text:'Please add a Title'})
  }
  if(!req.body.details){
    errors.push({text:'Please add some details'})
  }
  if(errors.length > 0){
    res.render('ideas/add',{
      errors,
      title: req.body.title,
      details: req.body.details
    });
  }else{
    let newUser = {
      title : req.body.title,
      details : req.body.details,
      user: req.user.id
    }
    new Idea(newUser)
    .save()
    .then(idea =>{
      res.redirect('/ideas')
    })
  }
  // res.send(req.body);
  
})

module.exports = router;