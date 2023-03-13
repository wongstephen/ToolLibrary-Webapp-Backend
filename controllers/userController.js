const express = require("express");
const router = express.Router();

const User = require("../models/User");

const bcrypt = require("bcrypt");
const { createUserToken, requireToken } = require("../middleware/auth");

// read all
// router.get("/", async (req, res, next) => {
//   try {
//     const data = await User.find({});
//     res.json(data);
//   } catch (err) {
//     next(err);
//   }
// });

// demo account
const demo = async (email) => {
  if (email === "demo@toollibrary.com") {
    const demoEmail = "demo@toollibrary.com" + Math.floor(Math.random() * 1000);
    try {
      let hashedPw = await bcrypt.hash("password", 10);
      await User.create({
        email: demoEmail,
        password: hashedPw,
      });
    } catch (err) {
      next(err);
    }
    return demoEmail;
  } else {
    return;
  }
};

// read single
router.get("/single/", requireToken, async (req, res, next) => {
  try {
    const data = await User.findById(req.user._id);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// create /users/signup
router.post("/signup", async (req, res, next) => {
  try {
    let hashedPw = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      email: req.body.email.toLowerCase(),
      password: hashedPw,
    });
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

// create /users/signin/
router.post("/signin", async (req, res, next) => {
  try {
    //creates a throwaway account for demo with unique email
    const demoAcccount = await demo(req.body.email.toLowerCase());
    if (demoAcccount) {
      req.body.email = demoAcccount;
    }
    const user = await User.findOne({ email: req.body.email.toLowerCase() });
    console.log(req.body.email);
    const token = createUserToken(req, user);
    res.json({ token, user });
    console.log(res);
  } catch (err) {
    next(err);
  }
});

//delete user at /user
router.delete("/", requireToken, async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user._Id);
    res.json(deletedUser);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  console.log();
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    res.json(deletedUser);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
