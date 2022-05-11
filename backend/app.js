const express = require("express");
const bodyParser = require("body-parser");
const app = express();

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
  const post = req.body;

  console.log(post);
  res.status(201).json({ msg: "post added successfully" });
});

app.get("/api/posts", (req, res, next) => {
  const posts = [
    { id: "fadf1231l", title: "xdddd", content: "from servaafdf343a" },
    { id: "fa321231l", title: "xdddsdsddd", content: "from sedddrvaaa" },
    { id: "fadf1231l", title: "xdddd", content: "from servddfdfaaa" },
  ];

  res.status(200).json({
    message: "posts fetched successfully",
    posts: posts,
  });
});

module.exports = app;
