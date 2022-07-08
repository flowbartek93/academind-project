const Post = require("../models/post");

exports.createPost = (req, res, next) => {
  const url = `${req.protocol}://${req.get("host")}`;

  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: `${url}/images/${req.file.filename}`,
    creator: req.userData.userId,
    //tu pewnie dalej z req.file tworzymy Schema
  });

  post
    .save()
    .then((createdPost) => {
      res.status(201).json({
        message: "Post added successfully",
        post: {
          ...createdPost,
          imagePath: createdPost.imagePath,
        },
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Creating a post failed",
      });
    });
};

exports.updatePost = (req, res, next) => {
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
    creator: req.userData.userId,
  });

  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
    .then((result) => {
      if (result.modifiedCount > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({ message: "Not authorizded" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Could not update post",
      });
    });
};

exports.getPosts = (req, res, next) => {
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
    return Post.count()
      .then((count) => {
        res.status(200).json({
          message: "Posts fetched successfully!",
          posts: fetchedPosts,
          maxPosts: count,
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: "fetching post failed",
        });
      });
  });
};

exports.getPost = (req, res, next) => {
  // pobranie konretnego posta
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  });
};

exports.deletePost = (req, res, next) => {
  //usunięcie
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(
    (result) => {
      if (result.deletedCount > 0) {
        res.status(200).json({ message: "Delete successful!" });
      } else {
        res.status(401).json({ message: "Not authorizded" });
      }
    }
  );
};
