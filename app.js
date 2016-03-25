var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose");
    
mongoose.connect("mongodb://localhost/country_picker");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

var destinationSchema = new mongoose.Schema({
    name: String,
    image: String,
    region: String,
    country: String,
    lifestyle: [],
    scenery: [],
    food: Number,
    activities: [],
    livingCost: String, 
    accessEase: Number
});

var Destination = mongoose.model("Destination", destinationSchema); 

app.get("/", function(req,res){
    res.render("landing");
});

// INDEX ROUTE
app.get("/destinations", function(req,res){
    Destination.find({}, function(err, allDestinations){
        if(err){
            console.log(err);
        } else {
            res.render("index", {destinations:allDestinations});
        }
    });
});

// NEW ROUTE
app.get("/destinations/new", function(req,res){
    res.render("new");
});

// CREATE ROUTE
app.post("/destinations", function(req,res){
    console.log(req.body);
    var name = req.body.name;
    var image = req.body.image;
    var region = req.body.region;
    var food = req.body.food;
    var livingCost = req.body.livingCost;
    var scenery = req.body.scenery;
    var lifestyle = req.body.lifestyle;
    var newDestination = {name: name, image: image, region: region, food:food, livingCost: livingCost, lifestyle: lifestyle, scenery: scenery};
    Destination.create(newDestination, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/destinations");
        }
    });
});

// SHOW ROUTE
app.get("/destinations/:id", function(req,res){
    Destination.findById(req.params.id, function(err,foundDestination){
        if(err){
            console.log(err);
        } else {
            res.render("show", {destination:foundDestination});
        }
    });
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is running...");
});
