const express = require("express");
const router = express.Router();
const User = require("../models/User");
// const Tool = require("../models/Tool");

const {
  handleValidateId,
  handleRecordExists,
  handleValidateOwnership,
} = require("../middleware/custom_errors");

const { requireToken } = require("../middleware/auth");

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
    await user.save();
    return res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

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
    .then(() => res.sendStatus(204))
    .catch(next);
});

module.exports = router;
