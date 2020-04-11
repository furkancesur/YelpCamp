var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	Campground = require("./models/campground"),
	Comment = require("./models/comment"),
	seedDB = require("./seeds")

//mongoose.set('useUnifiedTopology', true);

mongoose.connect("mongodb://localhost:27017/yelp_camp_v10", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use (express.static(__dirname + "/public"));
seedDB();

// Campground.create(
// 	{name: "Bartın", 
// 	 image:"https://pixabay.com/get/57e8d0424a5bae14f6da8c7dda793f7f1636dfe2564c704c7d2f79d59049c55c_340.jpg",
// 	 description:"This is huge granite hill"
// 	}, function(err, campground){
// 	if(err){
// 		console.log(err);
// 	} else {
// 		console.log("Newly Created Campground");
// 		console.log(campground);
// 	}
// });


// var campgrounds = [
// 		{name: "Istanbul", image:"https://pixabay.com/get/57e8d0424a5bae14f6da8c7dda793f7f1636dfe2564c704c7d2f79d59049c55c_340.jpg"},
// 		{name: "Bartın", image:"https://pixabay.com/get/57e8d0424a5bae14f6da8c7dda793f7f1636dfe2564c704c7d2f79d59049c55c_340.jpg"},
// 		{name: "Ankara", image:"https://pixabay.com/get/57e8d0424a5bae14f6da8c7dda793f7f1636dfe2564c704c7d2f79d59049c55c_340.jpg"},
// 		{name: "Istanbul", image:"https://pixabay.com/get/57e8d0424a5bae14f6da8c7dda793f7f1636dfe2564c704c7d2f79d59049c55c_340.jpg"},
// 		{name: "Bartın", image:"https://pixabay.com/get/57e8d0424a5bae14f6da8c7dda793f7f1636dfe2564c704c7d2f79d59049c55c_340.jpg"},
// 		{name: "Ankara", image:"https://pixabay.com/get/57e8d0424a5bae14f6da8c7dda793f7f1636dfe2564c704c7d2f79d59049c55c_340.jpg"},
// 	];


app.get("/", function(req, res){
	//res.send("This will be the landing page soon");
	res.render("landing");
});

app.get("/campgrounds", function(req, res){
	// get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		}else {
				res.render("campgrounds/index", {campgrounds: allCampgrounds});
		}
	});
});
	
app.post("/campgrounds", function(req, res){
	//res.send("You hit the post route")
	//get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var newCampground = {name: name, image:image, description:desc};
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

app.get("/campgrounds/new", function(req, res){
	res.render("campgrounds/new");
});

//Show -  more info about one campground
app.get("/campgrounds/:id", function(req, res){
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

//--------------------
//Comments routes
//--------------------

app.get("/campgrounds/:id/comments/new", function (req,res) {
	// find campground by id
	Campground.findById(req.params.id, function (err, campground) {
		if(err){
			console.log(err);
		}else{
			res.render("comments/new", {campground: campground});
		}
	});
});

app.post("/campgrounds/:id/comments", function (req, res) {
	// Lookup campground using ID
	Campground.findById(req.params.id, function (err, campground) {
		if (err){
			console.log(err);
			res.redirect("/campgrounds");
		}else{
			Comment.create(req.body.comment, function (err, comment) {
				if (err){
					console.log(err);
				}else{
					campground.comments.push(comment);
					campground.save();
					res.redirect('/campgrounds/'+ campground._id) ;
				}
			});

		}
	});
	// Create new comment
	// Connect new comment to campground
	// Redirect campground show page
});

app.listen(3000, function(){
	console.log("Server listening on port 3000");
});