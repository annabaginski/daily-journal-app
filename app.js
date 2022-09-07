//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require('mongoose');


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

let posts = [];

const app = express();

//CONNECT TO DATABASE

require('dotenv').config();

let dbConnectionStr = process.env.DB_STRING,
    dbName = 'journalEntries'

mongoose.connect(dbConnectionStr + 'journalEntries', {
  useNewUrlParser: true, useUnifiedTopology: true})
  .then(client => {
    console.log(`Connected to ${dbName} Database`)
  })
  .catch(err => {
    console.log("Database error: " + err)
  })

//MIDDLEWARE

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//SET UP SCHEMAS AND MODELS

const journalSchema = {
  title: String,
  content: String
}

const Journal = mongoose.model('Journal', journalSchema); 

//GETS

app.get('/', function (req,res) {

  Journal.find({}, (err, entries) => {
    console.log(entries)
  res.render('home.ejs', {content: homeStartingContent, posts: entries});  
  })
 
})

app.get('/about', function (req,res) {
  res.render('about.ejs', {content: aboutContent});
})

app.get('/contact', function (req,res) {
  res.render('contact.ejs', {content: contactContent});
})

app.get('/compose', function (req,res) {

  res.render('compose.ejs');
})

app.get('/posts/:postId', function(req,res) {
  let requestedPostId = req.params.postId;
  Journal.findOne({_id: requestedPostId}, (err, entry) => {
    if (err) {
      console.log(err);
    }else {
      res.render('post.ejs', {
        title: entry.title,
        content: entry.content
      });
    }
  })

});


//POSTS

app.post('/compose', function(req,res) {
  
  const newJournal = new Journal({
    title: req.body.postTitle,
    content: req.body.postBody 
  })

  newJournal.save();

  // const post = {
  //   title: req.body.postTitle,
  //   content: req.body.postBody
  // };

  // posts.push(post);
  
  res.redirect('/');
} )






//LISTENING PORT

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
