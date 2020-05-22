const express = require('express');

const router = express.Router();

const passport = require('passport');

var OrientDB = require('orientjs');

var errors = [];

var server = OrientDB({
   host:       'localhost',
   port:       2424,
   username:   'root',
   password:   'hello'
});

var db = server.use('Rental')
var users = db.class.get('User')
   .then(
      function(users){
         console.log('Retrieved class in usersjs: ' + users.name);
      }
   );

//login page
router.get('/login',(req,res) => res.render('login'));

//register
router.get('/register',(req,res) => res.render('register'));

//register handle
router.post('/register', (req, res) =>{
    const { Fname, Lname, EmailID, password, password2, Address, Pincode, MobileNo } = req.body;
    var errors = [];

    // check required fields
    if(!Fname || !Lname || !EmailID || !password || !password2 || !Address || !Pincode ||!MobileNo ){
        errors.push({ msg: 'Please fill in all the fields'});
    }

    //check passwords match
    if(password !== password2){
        errors.push({msg: 'Passwords do not match'});
    }

    if(password.length < 8) {
        errors.push({msg: 'Password should be atleast 8 chars long'}); 
    }


    if(errors.length > 0) {
        res.render('register', {
            errors,
            Fname, 
            Lname, 
            EmailID, 
            password, 
            password2, 
            Address, 
            Pincode, 
            MobileNo
        });
    }else {
        var user = db.select().from('User')
        .where({
           EmailID: EmailID
          }).one()
         .then(users => {
             if(users){
                 errors.push({ msg: 'Email already registered'});
                 res.render('register', {
                    errors,
                    Fname, 
                    Lname, 
                    EmailID, 
                    password, 
                    password2, 
                    Address, 
                    Pincode, 
                    MobileNo
                });
             } else {
                db.insert().into('User')
                .set({
                    Fname : Fname, 
                    Lname : Lname, 
                    EmailID : EmailID, 
                    Password : password, 
                    Address : Address, 
                    Pincode : Pincode, 
                    MobileNo : MobileNo
                    
                }).one()
                .then(
                    function(customer){
                        req.flash('success_msg', 'You are now registered and now can log in');
                        res.redirect('/users/login');
                    }).catch(err => console.log(err));
                
             }
         }
            
      );
    }
});

// Login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dash',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

//logout Handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Your are logged Out');
    res.redirect('/users/login');
});


router.get('/additem',(req,res) => res.render('additem'));

router.post('/additem', (req, res) =>{
    const { Pname, GenericName, Category, Description, Specifications, Price, img1, img2 } = req.body;
    var errors = [];

    // check required fields
    if(!Pname || !GenericName || !Category || !Description || !Specifications || !Price || !img1 ||!img2 ){
        errors.push({ msg: 'Please fill in all the fields'});
    }

    //check passwords match
    // if(password !== password2){
    //     errors.push({msg: 'Passwords do not match'});
    // }

    // if(password.length < 8) {
    //     errors.push({msg: 'Password should be atleast 8 chars long'}); 
    // }


    if(errors.length > 0) {
        res.render('register', {
            errors,
            Pname, 
            GenericName, 
            Category,
            Description, 
            Specifications, 
            Price, 
            img1, 
            img2
        });
    }else {
        
                db.insert().into('Product')
                .set({
                    Pname : Pname, 
                    GenericName : GenericName, 
                    Category : Category,
                    Description : Description, 
                    Specifications : Specifications, 
                    Price : Price, 
                    img1 : img1, 
                    img2 : img2,
                    Available : 1
                    
                }).one()
                .then(
                    function(customer){
                        //req.flash('success_msg', 'You are now registered and now can log in');
                        res.redirect('/users/dash');
                    }).catch(err => console.log(err));
                
             }
         
            
      
    
});

var obj = {};
var Pname, GenericName, Category, Description, Specifications, Price, img1, img2;
db.select().from('Product')
    .where({
       Category: "Electronics"
    }).one()
    .then(
       function(select){
         obj=select;
                      Pname = obj["Pname"]; 
                      GenericName = obj["GenericName"]; 
                      Category = obj["Category"];
                      Description = obj["Description"]; 
                      Specifications = obj["Specifications"]; 
                      Price = obj["Price"];
                      img1 = obj["img1"];
                      img2 = obj["img2"];
       }
    );
router.get("/Displayitem", (req, res) => { res.render("Displayitem", {Pname:Pname, GenericName:GenericName, Category:Category, Description:Description, Specifications:Specifications, Price:Price, img1:img1, img2:img2}); });

module.exports = router;