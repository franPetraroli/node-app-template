const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const app = express();
const port = 8080;

//Body parser middelware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Load ideas Routes
const ideas = require('./routes/ideas');
app.use('/ideas', ideas);

//Load User Routes
const users = require('./routes/users');
app.use('/users', users);

//Connect to MongoDb
mongoose.connect('mongodb://frapetim:telecono0@ds231070.mlab.com:31070/dang').then(() => {
  console.log('MongoDb Connected');
}).catch(err => {
  console.log(err);
});

//Handlebars midleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}))

app.set('view engine', 'handlebars');

//Methos override midleware
app.use(methodOverride('_method'));

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

//Start the server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})

