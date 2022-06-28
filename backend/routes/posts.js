const express = require("express");
const { closeSync } = require("fs");
const multer = require("multer");

const Post = require("../models/post");

const checkAuth = require("../middleware/check-auth");

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("invalid mime type");

    if (isValid) {
      error = null;
    }
    cb(null, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

router.post(
  "",
  checkAuth,
  multer({ storage: storage }).single("image"),

  (req, res, next) => {
    const url = `${req.protocol}://${req.get("host")}`;
    // console.log(res);

    console.log(req.protocol);
    console.log(req.file);

    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: `${url}/images/${req.file.filename}`,

      //tu pewnie dalej z req.file tworzymy Schema
    });

    post.save().then((createdPost) => {
      res.status(201).json({
        message: "Post added successfully",
        post: {
          ...createdPost,
          imagePath: createdPost.imagePath,
        },
      });
    });
  }
);

router.put(
  "/:id",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    console.log(req.file);

    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = `${req.protocol}://${req.get("host")}`;

      imagePath = url + "/images" + req.file.filename;
    }

    //edycja
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
    });
    Post.updateOne({ _id: req.params.id }, post).then((result) => {
      res.status(200).json({ message: "Update successful!" });
    });
  }
);

router.get("", (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;

  let fetchedPosts;
  const postQuery = Post.find();

  if (pageSize && currentPage) {
    postQuery.skip(currentPage - 1).limit(pageSize);
  }

  //pobranie postów
  postQuery.then((documents) => {
    console.log(documents);
    fetchedPosts = documents;
    return Post.count().then((count) => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: fetchedPosts,
        maxPosts: count,
      });
    });
  });
});

router.get("/:id", (req, res, next) => {
  // pobranie konretnego posta
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  });
});

router.delete("/:id", (req, res, next) => {
  //usunięcie
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    res.status(200).json({ message: "Post deleted!" });
  });
});

module.exports = router;
