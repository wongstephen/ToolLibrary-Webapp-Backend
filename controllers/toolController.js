const express = require("express");
const router = express.Router();
const User = require("../models/User");
const multer = require("multer");
const path = require("path");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

const {
  handleValidateId,
  handleRecordExists,
  handleValidateOwnership,
} = require("../middleware/custom_errors");

const { requireToken } = require("../middleware/auth");

const storage = multer.diskStorage({});
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      cb(new Error("File type is not supported"), false);
      return;
    }
    cb(null, true);
  },
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//get tools
router.get("/", requireToken, async (req, res, next) => {
  try {
    const userId = req.user._id;
    const data = await User.findById(userId);
    res.json(data.tool);
  } catch (err) {
    next(err);
  }
});

//create
router.post("/", requireToken, async (req, res, next) => {
  try {
    const toolData = req.body;
    toolData.owner = req.user._id;

    const user = await User.findById(toolData.owner);

    await user.tool.push(toolData);
    console.log(toolData);
    await user.save();
    return res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

//create with image
router.post(
  "/image",
  requireToken,
  upload.single("tool-image"),
  async (req, res, next) => {
    try {
      // form object with data and image url
      const toolData = req.body;
      if (req.file) {
        // upload image to cloudinary
        const options = {
          use_filename: true,
          unique_filename: false,
          overwrite: true,
          folder: "tool_library",
        };
        const result = await cloudinary.uploader.upload(req.file.path, options);
        const objectURL = result.secure_url;
        toolData.image = objectURL;
      }
      const user = await User.findById(toolData.owner);
      await user.tool.push(toolData);
      await user.save();
      return res.status(201).json(user);
    } catch (err) {
      console.log(err);
    }
  }
);

// patch /tools/:id
router.patch("/:id", requireToken, async (req, res, next) => {
  const id = req.params.id;
  const toolData = req.body;
  try {
    const user = await User.findOne({
      "tool._id": id,
    });
    const tool = user.tool.id(id);
    tool.set(toolData);
    user.save();
    res.status(202).json(user);
  } catch (err) {
    next(err);
  }
});

// delete /tools/:id
router.delete("/:id", requireToken, (req, res, next) => {
  const id = req.params.id;
  User.findOne({ "tool._id": id })
    .then((user) => {
      user.tool.id(id).remove();
      return user.save();
    })
    .then(() => res.sendStatus(202).json(user))
    .catch(next);
});

module.exports = router;
