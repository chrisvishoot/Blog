var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");
//app config
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
//mongoose model config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    //Default value for JSON object.
    created: {type: Date, default: Date.now }
});
var Blog = mongoose.model("Blog", blogSchema);
// Blog.create({
//   title: "Test Blog",
//   image: "https://www.google.com/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=0ahUKEwj1m9fNlufTAhVBGmMKHXqOAEsQjRwIBw&url=http%3A%2F%2Fwww.penguins-world.com%2Femperor-penguin%2F&psig=AFQjCNEo4qK3r4lqJUxTlW9g-1rK4IuEIw&ust=1494569286839134",
//   body: "This is a comment"
// });

// restful routes
app.get("/", function(req, res){
    res.redirect("/blogs");
});
app.get('/blogs', function(req, res) {
  Blog.find({}, function(err, blogs) {
    if(err) {
      console.log(err);
    } else {
      res.render('index', {blogs: blogs});
    }
  });
});

//New Route
app.get("/blogs/new", function(req, res){
   res.render("new"); 
});

//Create route
app.post("/blogs", function(req, res){
    //create blog
    //redirect
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err) {
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    });
    
});

//SHOW
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err) {
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundBlog});
        }
    })
})


//Edit and Update
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err) {
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundBlog});
        }
    });
   
});
//Update Route
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
       if(err) {
           res.redirect("/blogs");
       } else {
           res.redirect("/blogs/" + req.params.id);
       }
    });
});
//Delete Route
app.delete("/blogs/:id/", function(req, res){
    //destroy the blog
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err) {
            //console.log(err);
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    })
    //redirect somewhere
    
})

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is running");
});