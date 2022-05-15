const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const mongoose = require("mongoose");

const Post = require("./models/post");

mongoose
  .connect(
    `mongodb+srv://bartekbjj:lTvhDH2Q8meAHgRc@cluster0.yz12z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
  )
  .then(() => console.log("conntcted to database !!"))
  .catch(() => console.log("connection failed"));

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );

  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });

  post.save();

  console.log(post);
  res.status(201).json({ msg: "post added successfully" });
});

app.get("/api/posts", (req, res, next) => {
  Post.find().then((docs) => {
    res.status(200).json({
      message: "posts fetched successfully",
      posts: docs,
    });
  });
});

module.exports = app;
