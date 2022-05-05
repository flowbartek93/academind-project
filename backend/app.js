const express = require("express");

const app = express();

app.use("/api/posts", (req, res, next) => {
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
