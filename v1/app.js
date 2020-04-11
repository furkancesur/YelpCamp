var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var campgrounds = [
		{name: "Istanbul", image:"https://pixabay.com/get/57e8d0424a5bae14f6da8c7dda793f7f1636dfe2564c704c7d2f79d59049c55c_340.jpg"},
		{name: "Bartın", image:"https://pixabay.com/get/57e8d0424a5bae14f6da8c7dda793f7f1636dfe2564c704c7d2f79d59049c55c_340.jpg"},
		{name: "Ankara", image:"https://pixabay.com/get/57e8d0424a5bae14f6da8c7dda793f7f1636dfe2564c704c7d2f79d59049c55c_340.jpg"},
		{name: "Istanbul", image:"https://pixabay.com/get/57e8d0424a5bae14f6da8c7dda793f7f1636dfe2564c704c7d2f79d59049c55c_340.jpg"},
		{name: "Bartın", image:"https://pixabay.com/get/57e8d0424a5bae14f6da8c7dda793f7f1636dfe2564c704c7d2f79d59049c55c_340.jpg"},
		{name: "Ankara", image:"https://pixabay.com/get/57e8d0424a5bae14f6da8c7dda793f7f1636dfe2564c704c7d2f79d59049c55c_340.jpg"},
	];

app.get("/", function(req, res){
	//res.send("This will be the landing page soon");
	res.render("landing");
});

app.get("/campgrounds", function(req, res){
	
	res.render("campgrounds", {campgrounds: campgrounds});
});
	
app.post("/campgrounds", function(req, res){
	//res.send("You hit the post route")
	//get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var newCampground = {name: name, image:image};
	campgrounds.push(newCampground);
	//redirect back to campgrounds page
	res.redirect("/campgrounds");
	
});

app.get("/campgrounds/new", function(req, res){
	res.render("new.ejs");
});

app.listen(3000, function(){
	console.log("Server listening on port 3000");
});