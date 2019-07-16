// Set up dotenv for session secret key.
// require('dotenv').config();


var bCrypt = require('bcrypt');
var LocalStrategy = require('passport-local').Strategy;
var db = require("../models");

var generateHash = function (password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
};

var isValidPassword = function (userpass, password) {
    return bCrypt.compareSync(password, userpass);
}

module.exports = function (passport) {

    //serialize
    passport.serializeUser(function (user, done) {

        done(null, user.id);

    });

    // deserialize user 
    passport.deserializeUser(function (id, done) {


        db.User.findById(id).then(function (user) {
            if (user) {

                done(null, user.get());

            } else {

                done(user.errors, null);

            }

        });

    });

    //for local signup
    passport.use('local-signup', new LocalStrategy(
        {
            usernameField: 'userEmail',
            passwordField: 'userPassword',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function (req, email, password, done) {
            // res.send("WE ARE TRYING TO SIGN UP BABY", req, email, password, done);

            process.nextTick(function () {

                db.User.find(
                    {
                        email: email
                    }
                ).then(function (user) {
                    if (user.email) {
                        return done(null, false, {
                            message: 'That email is already taken!'
                        });

                    } else {
                        var userPassword = generateHash(password);
                        var data =
                        {
                            email: email,
                            password: userPassword,
                            name: req.body.name,
                        };
                        console.log("Creating new User", data);
                        db.User.create(data).then(function (newUser) {
                            if (!newUser) {
                                return done(null, false, "didn't create");
                            }
                            if (newUser) {
                                return done(null, newUser, "created");
                            }
                        });
                    }
                });


            })

        }
    ));

    //LOCAL SIGNIN
    passport.use('local-signin', new LocalStrategy(
        {
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'login-email',
            passwordField: 'login-password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },

        function (req, email, password, done) {

            db.User.find({
                email: email
            }).then(function (user) {
                if (!user) {
                    return done(null, false, {
                        message: 'Email does not exist'
                    });
                }
                if (!isValidPassword(user.userPassword, password)) {
                    return done(null, false, {
                        message: 'Incorrect password.'
                    });
                }

                var userinfo = user.get();
                return done(null, userinfo);
            }).catch(function (err) {
                console.log("Error:", err);
                return done(null, false, {
                    message: 'Something went wrong with your Signin'
                });
            });
        }
    ));

}