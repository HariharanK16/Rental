const express = require('express');
const expressLayouts = require('express-ejs-layouts');
var bodyParser = require("body-parser"); 
const app = express();
const PORT = process.env.PORT || 3000;
const flash = require('connect-flash');
const session = require('express-session');

const passport = require('passport');

var OrientDB = require('orientjs');

var server = OrientDB({
   host:       'localhost',
   port:       2424,
   username:   'root',
   password:   'hello'
});

var db = server.use('Rental')
console.log('Using Database:', db.name);

var users = db.class.get('User')
   .then(
      function(users){
         console.log('Retrieved class: ' + users.name);
      }
   );
// Passport config
require('./config/passport')(passport);
//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs')

//bodyparser
app.use(express.urlencoded({extended: false}));

// Express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }))

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

//global vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});


//routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))


app.listen(PORT, () => console.log(`Rental app listening at http://localhost:${PORT}`))