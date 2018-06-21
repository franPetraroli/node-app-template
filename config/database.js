if(process.env.NODE_ENV === 'production'){
  module.exports = {
    mongoURI: 'mongodb://frapetim:telecono0@ds231070.mlab.com:31070/dang'
  }
}else{
  //Local Database
  module.exports = {
    mongoURI: 'mongodb://frapetim:telecono0@ds231070.mlab.com:31070/dang'
  }
}