var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose");

//mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost:27017/yelp_camp_v10", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
});

var Campground = mongoose.model("Campground", campgroundSchema);
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
				res.render("index", {campgrounds: allCampgrounds});
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
	res.render("new.ejs");
});

//Show -  more info about one campground
app.get("/campgrounds/:id", function(req, res){
	//find the campground with provided id 
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log(err);
		}else {
			//render show template with that campground 
			res.render("show", {campground: foundCampground});
		}
	});
});

app.listen(3000, function(){
	console.log("Server listening on port 3000");
});