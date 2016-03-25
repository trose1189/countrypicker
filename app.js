// Include the npm packages that are installed, including turning express into the app variable. 
// These could each be listed as separate vars, or grouped together with commas. The spacing is purely a matter of preferance.
var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    Campground      = require("./models/campgrounds.js"),
    Comment         = require("./models/comments.js"),
    User            = require("./models/user.js"),
    seedDB          = require("./seeds.js");
    
// Everytime the server starts, run seedDB to clear the database
seedDB();
// Connect this file to the database in mongo
mongoose.connect("mongodb://localhost/yelp_camp");
// Tell express to USE body parser, the package for post routes into a db
app.use(bodyParser.urlencoded({extended: true}));
// Tell express that connected file routes will be ejs files
app.set("view engine", "ejs");
// Tell app to use CSS in public directory (__dirname will always be the name of the directory that the script lives in)
app.use(express.static(__dirname + "/public"));

// Site's POST and GET routes
app.get("/", function(req,res){
    res.render("landing");
});

// INDEX - show all campgrounds
app.get("/campgrounds", function(req,res){
    // Get all campgrounds from db 
    // then run a callback function to give an error OR ELSE render all the campgrounds on the campgrounds ejs file
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds:allCampgrounds});
        }
    });
});

// NEW - show form to create new campground
app.get("/campgrounds/new", function(req,res){
    res.render("campgrounds/new");
});

// CREATE - add new campground to db
app.post("/campgrounds", function(req,res){
    // Get data from form and save to a new object
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = {name: name, image: image, description: description};
    // Create a new campground in the database
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            // Redirect back to the campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

// SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req,res){
    // find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground);
            // render show template with that campground
            res.render("campgrounds/show", {campground:foundCampground});
        }
    });
});

// =====================
// COMMENT ROUTES
// =====================

app.get("/campgrounds/:id/comments/new", function(req,res){
    // Find Campground by ID
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

app.post("/campgrounds/:id/comments", function(req,res){
    // Lookup campground using id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            // create new comment
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

// Tell Express to listen for the server, and tell us when it is started
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp server started...");
});  
