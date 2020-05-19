const LocalStrategy = require('passport-local').Strategy;
var OrientDB = require('orientjs');

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
         console.log('Retrieved class for login: ' + users.name);
      }
   );

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email'}, (email, password, done)=> {
            //Match user
            var user = db.select().from('User')
            .where({
                EmailID: email
            }).one()
            .then(user => {
                if(!user){
                    return  done(null, false, {message: 'Please enter a registered E-mail'});
                }

                //Match password
                if(user.Password === password) {
                    return done(null,user);
                } else {
                    return done(null, false, { message: 'Incorrect Password'})
                }
            })
            .catch(err => console.log(err));
        } )
    );

    passport.serializeUser(function(user, done) {
        done(null, user);
      });
      
      passport.deserializeUser(function(user, done) {
        done(null, user);
      });
}