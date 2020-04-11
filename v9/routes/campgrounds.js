var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

//Index route
router.get("/", function(req, res){
    // get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
        }
    });
});

//Create route
router.post("/",isLoggedIn  ,function(req, res){
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, image:image, description:desc, author:author};
    //create a new campground and save to DB, push olan kısım devre dışı kalıyor.
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        }else{
            res.redirect("/campgrounds");
        }
    });
    //campgrounds.push(newCampground);
    //redirect back to campgrounds page
    //res.redirect("/campgrounds");
});

//New route
router.get("/new", isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

//Show -  more info about one campground
router.get("/:id", function(req, res){
    //find the campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }else {
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;