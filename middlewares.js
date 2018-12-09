
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var config = require('./config/globals');
var logger = config.logger;
var db = config.mysql.getClient();
var Users = db.import('./models/users');

function loadSessionHandlers() {
 
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(user_id, done) {
        try {
            Users.findOne({
                where: {
                    id: user_id
                }
            }).then(function(user) {
                done(null, user);
            }).catch(function(err) {
                done(err, null);
            });
        } catch (err) {
            done(err, null);
        }
    });  
}

function loadStrategies() {
   

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function(req, email, password, done) {
        Users.findOne({
            where: {
                email: email
            }
        }).then(function(user) {
            if (!user) {
                req.session.alert_error = 'Uh oh! This email does not exist.';
                req.session.email = email;
                return done(null, false, { message: '' });
            } else if (!bcrypt.compareSync(password, user.dataValues.password)) {
                req.session.alert_error = 'Uh oh! The password does not match.';
                req.session.email = email;
                return done(null, false, { message: '' });
            } else {
                return done(null, user);
            }
        }).catch(function(err) {
            logger.error('Failed to authenticate:', email, err);
            return done('Inernal Server Error');
        });
    }));

 
}

/* function to make sure certain requests are authorized */
let requireAuthorization = function(req, res, next) {

    var user = req.user;
    if (!user) {
        res.redirect('/login');
    }  else {
        next();
    }
};


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}


// Module exports.
module.exports = {
    loadSessionHandlers: loadSessionHandlers,
    loadStrategies: loadStrategies,
    requireAuthorization: requireAuthorization
};