const express = require("express");
const router = express.Router();
const User = require("../models/Tool");

//create
router.post("/", (req, res, next) => {
  const toolData = req.body;
  const userId = toolData.owner;
  User.findById(userId)
    .then((user) => {
      user.tool.push(toolData);
      return user.save();
    })
    .then((user) => res.status(201).json({ user: user }))
    .catch(next);
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
