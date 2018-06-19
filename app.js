const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 8080;

//Connect to MongoDb
mongoose.connect('mongodb://frapetim:telecono0@ds231070.mlab.com:31070/dang').then(() => {
  console.log('MongoDb Connected');
}).catch(err => {
  console.log(err);
});

//Body parsr middelware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Looke for Idea model
require('./models/Ideas');
const Idea = mongoose.model('ideas')

app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}))

app.set('view engine', 'handlebars');

//#####  ROUTES ########

//Handle get requesdt for home page
app.get('/', (req, res) => {
  let title = 'Welcome'
  res.render('index', {
    title
  })
})

//Handle About route
app.get('/about', (req, res) => {
  res.render('about')
})

//Idea get handler
app.get('/ideas', (req, res) => {
  Idea.find({}).sort({date:'desc'}).then(ideas =>{
    res.render('ideas/index',{
      idea
    })
  })
})

//Handle ideas/add route
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add')
})


app.get('/ideas/edit/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea =>{
    res.render('ideas/edit', {
      idea
    })
  })
  
})

app.put('/ideas/:id', (req, res) => {
  res.send('put request')
  
})

//Process form idea
app.post('/ideas', (req, res) => {
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

//Start the server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})