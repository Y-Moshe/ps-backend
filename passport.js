const passport = require('passport'),
      bcrypt = require('bcryptjs'),
      LocalStrategy = require('passport-local').Strategy,
      passportJwt = require('passport-jwt'),
      JwtStrategy = passportJwt.Strategy,
      ExtractJwt = passportJwt.ExtractJwt;
      
const { JWT_SECRET } = require('./config');
const { User } = require('./models');

/**
* After a success authentication on LocalStrategy or JwtStrategy passport saves user data on "req.user"
* "passport.authenticate" or "authenticate" from the middlewares folder should be used before!
*/
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false
}, (username, password, done) => {
    User.findOne({ email: username }).lean()
        .then(user => {
        if (!user) {
            return done(null, false, { message: 'Incorrect email!' });
        }

        if (!bcrypt.compareSync(password, user.password)) {
            return done(null, false, { message: 'Incorrect password!' });
        }

        // onSuccess login set user to req.user
        done(null, user);
    }).catch(error => done( error ));
}));

passport.use(new JwtStrategy({
    secretOrKey: JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}, (payload, done) => {
    done(null, payload);
}));
