const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//Looke for Idea model
require('../models/Idea');
const Idea = mongoose.model('ideas')

//Idea get handler
router.get('/', (req, res) => {
  Idea.find({}).sort({date:'desc'}).then(ideas =>{
    res.render('ideas/index',{
      ideas
    })
  })
})

//Handle ideas/add route
router.get('/add', (req, res) => {
  res.render('ideas/add')
})


router.get('/edit/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea =>{
    res.render('ideas/edit', {
      idea
    })
  })
  
})

router.put('/:id', (req, res) => {
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

router.delete('/:id', (req, res) => {
  Idea.remove({_id: req.params.id}).then(()=>{
    res.redirect('/ideas')
  })
})

//Process form idea
router.post('/', (req, res) => {
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
      details: req.body.deta
    });
  }else{
    let newUser = {
      title : req.body.title,
      details : req.body.details
    }
    new Idea(newUser)
    .save()
    .then(idea =>{
      res.redirect('/ideas')
    })
  }
})

module.exports = router;