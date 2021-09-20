const express = require("express");
const router = express.Router();
const User = require("../Models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

router.post("/register", async (req, res) => {
  // Our register logic starts here
  try {
    // Get user input
    const { first_name, last_name, email, password } = req.body;

    // Validate user input
    if (!(email && password && first_name && last_name)) {
      res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });

    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    // save user token
    user.token = token;

    // return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
});

router.post("/login", async (req, res) => {
  // Our login logic starts here
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.token = token;

      // user
      res.status(200).json(user);
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
});

//post
router.post("/", async (req, res) => {
  try {
    const newUser = new User(req.body);
    const response = await newUser.save();
    res.send({ message: "user saved" });
  } catch (error) {
    res.status(400).send({ message: "can not save it" });
  }
});

//get all
router.get("/", async (req, res) => {
  try {
    const result = await User.find();
    res.send({ response: result, message: "geeting Users succesfully" });
  } catch (error) {
    res.status(400).send("can not get Users");
  }
});
//get one
router.get("/:id", async (req, res) => {
  try {
    const result = await User.findOne({ _id: req.params.id });
    res.send({ response: result, message: "geeting Users succesfully" });
  } catch (error) {
    res.status(400).send("no User with this id");
  }
});
//delete
router.delete("/:id", async (req, res) => {
  try {
    const result = await User.deleteOne({ _id: req.params.id });
    result.n
      ? res.send({ response: result, message: " succesfully deleted" })
      : res.send({ message: "already deleted" });
  } catch (error) {
    res.status(400).send("User not found");
  }
});
//update
router.put("/:id", async (req, res) => {
  try {
    const result = await User.updateOne(
      { _id: req.params.id },
      { $set: { ...req.body } }
    );
    console.log(result);
    result.nModified
      ? res.send({ message: "updated" })
      : res.send({ message: "already updated" });
  } catch (error) {
    res.status(400).send({ message: "User not updated" });
  }
});

module.exports = router;
