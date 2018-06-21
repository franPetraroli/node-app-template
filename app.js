const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const passport = require('passport')
const flash = require('connect-flash')
const session = require('express-session')

const app = express();
const port = process.env.PORT || 8080;

//Body parser middelware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Load ideas Routes
const ideas = require('./routes/ideas');


//Load User Routes
const users = require('./routes/users');


//import Passport config and middleware
require('./config/passport')(passport)
const db = require('./config/database')

//Connect to MongoDb
mongoose.connect(db.mongoURI).then(() => {
  console.log('MongoDb Connected');
}).catch(err => {
  console.log(err);
});

//Handlebars midleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}))

app.set('view engine', 'handlebars');

//Methods override midleware
app.use(methodOverride('_method'));

// Express session middleware
app.use(session({
  secret: 'mimi cat',
  resave: true,
  saveUninitialized: true,
}))

//Passport config and middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect flash middleware
app.use(flash())

//Global Variables
app.use((req,res,next)=>{
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  res.locals.user = req.user || null
  next()
})

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

app.use('/ideas', ideas);
app.use('/users', users);

//Start the server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})

