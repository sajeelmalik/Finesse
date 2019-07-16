// Sajeel Malik
// server.js for Finesse

// ========================= INITIALIZATION =========================
// Set up dotenv for session secret key.
// require('dotenv').config();

// ========================= DEPENDENCIES ===========================

var express = require("express");
var session = require('express-session');
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var passport = require('passport');
var mongoose = require("mongoose");
var bCrypt = require("bcrypt");

var axios = require("axios");
var cheerio = require("cheerio");

var PORT = process.env.PORT || 8000;

// ======================= EXPRESS =======================

// Initialize express app
var app = express();

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//======================= MIDDLEWARE =======================

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use built in parsing middleware for handling form submissions
app.use(express.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// ======================= MONGO DB =======================

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
// Added useNewUrlParser based on current mongo version (4.0.2)
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Require all models
var db = require("./models");

// ======================= PASSPORT =======================

app.use(cookieParser());

// load passport strategies
require('./config/passport')(passport);

app.use(session({ 
    secret: (process.env.secret || 'keyboard cat'), 
    resave: true, 
    saveUninitialized: true, 
    cookie: {   
        expires: 2592000000,
        httpOnly: false,
        secure: false } 
    })); // session secret

// Initialize passport authentication 
app.use(passport.initialize());

// Persistent login sessions
app.use(passport.session()); 

// Enable CORS so that browsers don't block requests.
app.use((req, res, next) => {
    //access-control-allow-origin http://localhost:3000
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// Routes

// GET route for scraping
app.get("/", function (req, res) {

    res.redirect("/splash");
    // First, we grab the body of the html with axios
    // axios.get("https://www2.hm.com/en_us/sale/men/view-all.html")
    //     .then(function (response) {
    //         // Then, we load that into cheerio and save it to $ for a shorthand selector
    //         var $ = cheerio.load(response.data);
    //         const home = "https://www2.hm.com/";

    //         var saleItems = [];

    //         // Iterate through each class of "product item" on the page to scrape the specific sales
    //         $("li.product-item").each(function (i, element) {
    //             // Save an empty result object
    //             var result = {};

    //             // Add text and href of every link, and save them as properties of the result object
    //             result.title = $(this).find("h3.item-heading").children("a").text();
    //             result.link = home + $(this).find("div.image-container").children("a").attr("href");
    //             result.price = $(this).find("strong.item-price").children("span.sale").text();
    //             if ($(this).find(".item-image").attr("src")) {
    //                 result.image = $(this).find(".item-image").attr("src");
    //             }
    //             else {
    //                 result.image = $(this).find(".item-image").attr("data-src");
    //             }

    //             saleItems.push(result);
    //         });

    //         // return res.send("hello"); //temporary debugging test

    //         // Create a new Sale using the `result` object built from scraping
    //         db.Sale.insertMany(saleItems)
    //             // Initial attempt - works perfectly locally 
    //             .then(function (dbSale) {
    //                 // Push the added result to our array to develop our JSON - here, I attempted to redirect to /home instead of directly rendering the index as a potential solution to an asynchornicity problem

    //                 // res.render("index", { item: dbSale });
    //                 res.redirect("/home")
    //             })
    //             .catch(function (err) {
    //                 // send error to client
    //                 return res.json(err);
    //             });

    //         //====Debugging attempt 2 - try/catch/finally
    //         // try {
    //         //     db.Sale.insertMany(saleItems)
    //         // } catch (err) {
    //         //     console.log(err)
    //         // } finally {
    //         //     res.redirect("/home")
    //         // }

    //         //====Debugging attempt 3 - timeout
    //         // setTimeout(function(){
    //         //     axios.get("/sales")
    //         //         // With that done, add the note information to the page
    //         //         .then(function (data) {
    //         //             res.render("index", { item: data });
    //         //         });
    //         // }, 5000)



    //     })
    //     //====Debugging attempt 4 - add a catch to the axios.get
    //     .catch(function (err) {
    //         // send error to client
    //         return res.json(err);
    //     });


});

app.get("/scrape", function (req, res) {
    axios.get("https://www2.hm.com/en_us/sale/men/view-all.html")
        .then(function (response) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(response.data);
            const home = "https://www2.hm.com/";

            var saleItems = [];

            // Iterate through each class of "product item" on the page to scrape the specific sales
            $("li.product-item").each(function (i, element) {
                // Save an empty result object
                var result = {};

                // Add text and href of every link, and save them as properties of the result object
                result.title = $(this).find("h3.item-heading").children("a").text();
                result.link = home + $(this).find("div.image-container").children("a").attr("href");
                result.price = $(this).find("strong.item-price").children("span.sale").text();
                if ($(this).find(".item-image").attr("src")) {
                    result.image = $(this).find(".item-image").attr("src");
                }
                else {
                    result.image = $(this).find(".item-image").attr("data-src");
                }
                result.store = "H&M";
                // result.imageURL = "assets/images/H&M.png";

                saleItems.push(result);
            });

            // return res.send("hello"); //temporary debugging test

            // Create a new Sale using the `result` object built from scraping
            db.Sale.insertMany(saleItems)
                // Initial attempt - works perfectly locally 
                .then(function (dbSale) {
                    // Push the added result to our array to develop our JSON - here, I attempted to redirect to /home instead of directly rendering the index as a potential solution to an asynchornicity problem

                    // res.render("index", { item: dbSale });
                    res.redirect("/home");
                })
                .catch(function (err) {
                    // error is actually in the backend
                    console.log(err);
                    // return res.json(err); // send error to client 

                    //redirect to home
                    return res.redirect("/home");
                });

        })
        //====Debugging attempt 4 - add a catch to the axios.get
        .catch(function (err) {
            // send error to client
            return res.json(err);
        });


});

// Route for getting all Sales from the db 
app.get("/home", function (req, res) {
    // Grab every document in the Sales collection
    db.Sale.find({})
        .then(function (dbSale) {
            // If we were able to successfully find Sales, send them back to the client
            res.render("index", { item: dbSale });
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for getting signup page
app.get("/signup", function (req, res) {
    res.render("signup");
});

// Route for getting login page
app.get("/login", function (req, res) {
    res.render("login");
});

// Route for getting splash page
app.get("/splash", function (req, res) {
    res.render("splash");
});


// Route for getting all Sales from the db
app.get("/sales", function (req, res) {
    // Grab every document in the Sales collection
    db.Sale.find({})
        .then(function (dbSale) {
            // If we were able to successfully find Sales, send them back to the client
            res.json(dbSale);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for grabbing a specific Sale by id, populate it with it's note
app.get("/sales/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Sale.findOne({ _id: req.params.id })
        // ..and populate all of the notes associated with it
        .populate("note")
        .then(function (dbSale) {
            // If we were able to successfully find an Sale with the given id, send it back to the client
            res.json(dbSale);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for saving/updating an Sale's associated Note
app.post("/sales/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
        .then(function (dbNote) {
            // If a Note was created successfully, find one Sale with an `_id` equal to `req.params.id`. Update the Sale to be associated with the new Note
            // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
            // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
            return db.Sale.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function (dbSale) {
            // If we were able to successfully update a Sale, send it back to the client
            res.json(dbSale);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

app.put("/sales/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    console.log("body", req.body);

    db.Sale.findOneAndUpdate({ _id: req.params.id }, { saved: req.body.saved })
        .then(function (dbSale) {
            // If we were able to successfully update a Sale's saved value, send it back to the client
            res.json(dbSale)
        });

});

app.get("/saved", function (req, res) {
    db.Sale.find({ saved: true }).populate("note").then(function (data) {
        //   console.log(data)
        res.render("index", { item: data });
    }).catch(function (err) {
        res.json(err)
    })
});


app.post('/signup', function (req, res, next) {

    // var generateHash = function (password) {
    //     return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
    // };

    // db.User.find(
    //     {
    //         email: req.body.email
    //     }
    // ).then(function (user) {
    //     if (user.email) {
    //         return res.json({message:'That email is already taken!', user: user});

    //     } else {
    //         var userPassword = generateHash(req.body.password);
    //         var data =
    //         {
    //             email: req.body.email,
    //             password: userPassword,
    //             name: req.body.name,
    //         };
    //         console.log("Creating new User", data);
    //         db.User.create(data).then(function (newUser, created) {
    //             if (!newUser) {
    //                 return res.send(false);
    //             }
    //             if (newUser) {
    //                 return res.json(newUser);
    //             }
    //         });
    //     }
    // });

    // end test
    passport.authenticate('local-signup',
        function (err, user, info) {

            console.log(err, user, info);

            if (err) {
                console.log("41", err)
                return next(err);
            }

            if (!user) {
                console.log("not a user")
                // req.flash('notify', 'This is a test notification.')
                return res.send("Please re-enter your email and password");
            }

            req.login(user, err => {
                if (err) {
                    return next(err);
                }

                res.cookie("userName", user[0].userName);
                res.cookie("email", user[0].email)
                res.cookie("user_id", user[0]._id);
                var userI = {
                    username: user[0].userName,
                    email: user[0].email
                }
                //redirect to path containing user id2
                return res.redirect("/home");
            })

        })(req, res, next)

});


app.post('/login', passport.authenticate('local-signin', {
    successRedirect: '/home',
    failureRedirect: '/login'
}), function (res, req) {
    console.log("signing in...")
}
);

app.get('/signout', function (req, res) {
    res.clearCookie('userid');

    req.session.destroy(function (err) {

        res.redirect('/');

    });
});

// function designed to check login state
function isLoggedIn(req, res, next) {

    if (req.isAuthenticated())

        return next();

    res.redirect('/login');

}

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
