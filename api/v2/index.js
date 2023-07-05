var express = require("express");
var router = express.Router();

const userController = require("./controllers/userController.js");
router.use("/user", userController);

const toolController = require("./controllers/toolController.js");
router.use("/tool", toolController);

router.get("/", async (req, res) => {
  res.status(200).send("V2 API");
});

module.exports = router;
