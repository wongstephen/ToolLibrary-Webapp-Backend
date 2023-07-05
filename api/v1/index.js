var express = require("express");
var router = express.Router();

const userController = require("./controllers/userController.js");
router.use("/user", userController);

const toolController = require("./controllers/toolController");
router.use("/tool", toolController);

module.exports = router;
