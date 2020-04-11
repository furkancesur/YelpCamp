var Comment = require("../models/comment");
var Campground = require("../models/campground");
var middlewareObj = {};

middlewareObj.checkCampground = function (req,res,next) {
        if(req.isAuthenticated()){
            Campground.findById(req.params.id, function (err, foundCampground) {
                if(err){
                    req.flash("error", err.message);
                    res.redirect("back");
                    console.log(err);
                }else{
                    if (foundCampground.author.id.equals(req.user._id)){
                        next();
                    }else{
                        req.flash("error", "You don't have permission");
                        res.redirect("back");
                    }
                }
            });
        }else{
            req.flash("error", "You need to be logged in to do that");
            res.redirect("back");
        }
};

middlewareObj.checkComment = function (req,res,next) {
        if(req.isAuthenticated()){
            Comment.findById(req.params.comment_id, function (err, foundComment) {
                if(err){
                    res.redirect("back");
                    console.log(err);
                }else{
                    if (foundComment.author.id.equals(req.user._id)){
                        next();
                    }else{
                        req.flash("error", "You don't have permission");
                        res.redirect("back");
                    }
                }
            });
        }else{
            req.flash("error", "You need to be logged in to do that");
            res.redirect("back");
        }
};

middlewareObj.isLoggedIn = function(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error", "You need to be login to do that");
        res.redirect("/login");
};

module.exports = middlewareObj;