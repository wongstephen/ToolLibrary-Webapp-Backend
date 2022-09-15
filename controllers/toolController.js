const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Tool = require("../models/Tool");

const {
  handleValidateId,
  handleRecordExists,
  handleValidateOwnership,
} = require("../middleware/custom_errors");
const { requireToken } = require("../middleware/auth");

//get tools
router.get("/", async (req, res, next) => {
  try {
    const data = await Tool.find({});
    res.json(data);
  } catch (err) {
    next(err);
  }
});

//create
router.post("/", async (req, res, next) => {
  try {
    const toolData = req.body;
    const userId = toolData.owner;
    const user = await User.findById(userId);
    await user.tool.push(toolData);
    await user.save();
    return res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

// delete /tool/:id
router.delete("/:id", (req, res, next) => {
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
