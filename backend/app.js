const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const mongoose = require("mongoose");

const postsRoutes = require("./routes/posts");
app.use(bodyParser.urlencoded({ extended: false }));

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
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );

  next();
});

app.use("/api/posts", postsRoutes);

module.exports = app;
