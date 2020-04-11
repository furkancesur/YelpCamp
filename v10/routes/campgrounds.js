var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

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
router.post("/",middleware.isLoggedIn, function(req, res){
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
router.get("/new", middleware.isLoggedIn, function(req, res){
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

//Edit
router.get("/:id/edit", middleware.checkCampground,function (req,res) {
        Campground.findById(req.params.id, function (err, foundCampground) {
                    res.render("campgrounds/edit", {campground: foundCampground});
        });
});
router.put("/:id", middleware.checkCampground, function (req,res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
        if (err){
            res.redirect("/campgrounds");
        } else{
            res.redirect("/campgrounds/" + req.params.id)
        }
    });
});

//Destroy
router.delete("/:id", middleware.checkCampground, function (req, res) {
   Campground.findByIdAndRemove(req.params.id, function (err) {
       if(err){
           res.redirect("/campgrounds");
       }else{
           res.redirect("/campgrounds");
       }
   });
});

module.exports = router;