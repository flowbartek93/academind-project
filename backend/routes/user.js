const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      email: req.body.email,
      password: hash,
    });

    user
      .save()
      .then((result) =>
        res.status(201).json({
          message: "user created",
          result: result,
        })
      )
      .catch((err) => {
        res.status(500).json({
          message: err,
        });
      });
  });
});

router.post("/login", (req, res, next) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if (!user) {
      return res.status(401).json({
        message: "login failed",
      });
    }

    return bcrypt
      .compare(req.body.password, user.password)
      .then((result) => {
        if (!result) {
          return res.status(401).json({
            message: "login failed",
          });
        }
        if (result) {
          const token = jwt.sign(
            { email: user.email, userId: user._id },
            "longer",
            {
              expiresIn: "1h",
            }
          );

          res.status(200).json({
            token: token,
          });
        }
      })
      .catch((err) => {
        return res.status(401).json({
          message: "login failed",
        });
      });
  });
});

module.exports = router;
