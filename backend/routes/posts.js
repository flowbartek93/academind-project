const express = require("express");
const multer = require("multer");

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

const postsController = require("../controllers/posts");

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

router.post("", checkAuth, extractFile, postsController.createPost);

router.put("/:id", checkAuth, extractFile, postsController.updatePost);

router.get("", postsController.getPosts);

router.get("/:id", postsController.getPost);

router.delete("/:id", checkAuth, postsController.deletePost);

module.exports = router;
