const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const Post = require("../Models/post");
const { check, validationResult } = require("express-validator");

// post

router.post("/", (req, res) => {
  const { title, description, type, by } = req.body;
  if (!title || !description || !type || !by) {
    res.status(422).json({ error: "please add all the fields" });
  }
  const post = new Post({
    title,
    description,
    type,
    by,
  });
  post
    .save()
    .then((result) => {
      res.json({ post: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

//@Method PUT
//@desc update one post by id
//@Path: http://localhost:6000/posts/update/:id
//@Params id Body
router.put("/:id", async (req, res) => {
  try {
    const result = await Post.updateOne(
      { _id: req.params.id },
      { $set: { ...req.body } }
    );
    result.nModified
      ? res.send({ message: "Post updated" })
      : res.send({ message: "Post already updated" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "there is no post with this id" });
  }
});

//@Method DELETE
//@des delete one post by id
//@Path: http://localhost:6000/posts/delete/:id
//@Params id
router.delete("/:id", async (req, res) => {
  try {
    const result = await Post.deleteOne({ _id: req.params.id });
    result.n
      ? res.send({ reponse: "post deleted" })
      : res.send("There is no post with this id");
  } catch (error) {
    res.send("Not deleted");
    console.log(error);
  }
});

//@Method GET
//@des GET one post
//@Path: http://localhost:6000/posts/post/:id
//@Params id

router.get("/post/:id", async (req, res) => {
  try {
    const result = await Post.findOne({ _id: req.params.id })
      .populate("by", "_id first_name avatar")
      .populate("feedback.user", "_id first_name avatar");
    res.send({ response: result, message: "Getting post successfully " });
  } catch (error) {
    res.status(400).send({ message: "There is no post with this id" });
  }
});

// get all posts
//get
// http://localhost:5000/allpost

router.get("/", (req, res) => {
  Post.find()
    .populate("by", "_id first_name avatar")
    .populate("feedback.user", "_id first_name avatar")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => {
      console.log(err);
    });
});

// get posts by user
// get
// http://localhost:5000/mypost
router.get("/mypost", auth, (req, res) => {
  Post.find({ by: req.user.user_id })
    .populate("by", "_id first_name avatar")
    .populate("feedback.user", "_id first_name avatar")
    .then((myposts) => {
      res.json({ myposts });
    })
    .catch((err) => {
      console.log(err);
    });
});

//feedback posts
//put
//http://localhost:5000/posts/feedback/post:id

router.put("/feedback/:id", auth, async (req, res) => {
  try {
    const newFeedback = {
      text: req.body.text,
      user: req.user.user_id,
    };
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { feedback: newFeedback } }
    );
    // .populate("feedback.user", "_id first_name last_name avatar")
    // .populate("by", "_id first_name avatar");

    res.status(200).json(post.feedback);
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

//rate posts
//put
//http://localhost:5000/posts/rate/post:id

router.put("/rate/:id", auth, async (req, res) => {
  console.log(req.params.id);
  try {
    const newRate = req.body.rate;
    const thePost = await Post.findById({ _id: req.params.id });
    const oldRate = thePost.rate;
    const toAddRate = (oldRate + newRate) / 2;
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { rate: toAddRate } }
    );
    res.status(200).json(post.rate);
  } catch (error) {
    res.status(500).send(error);
  }
});

//delete comment posts
//put
//http://localhost:5000/comment/post id / comment id

router.delete("/feedback/:id/:feedback_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const feedback = post.feedback.find(
      (fb) => fb._id == req.params.feedback_id
    );
    console.log(feedback);
    if (!feedback) {
      return res.status(404).json({ msg: "comment does not exist" });
    }
    if (feedback.user.toString() !== req.user.user_id) {
      return res.status(401).json({ msg: "user not authorized" });
    }

    const removeindex = post.feedback
      .map((feedback) => feedback.user.toString())
      .indexOf(req.user.user_id);
    post.feedback.splice(removeindex, 1);
    console.log(post);
    await post.save();
    res.json(post.feedback);
  } catch (error) {
    res.status(500).send({ error: error });
  }
});

//add reservation
//put
//http://localhost:5000/posts/reserve/post:id

router.put("/reserve/:id", auth, async (req, res) => {
  try {
    const newReservation = {
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      reservedBy: req.user.user_id,
    };
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { reservations: newReservation } }
    );
    // .populate("feedback.user", "_id first_name last_name avatar")
    // .populate("by", "_id first_name avatar");

    res.status(200).json(post.feedback);
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;
