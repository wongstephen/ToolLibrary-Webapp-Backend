var express = require("express");
var router = express.Router();
var app = express();

router.use("/v1", require("./v1/index.js"));

router.use("/v2", require("./v1/index.js"));

router.get("/", (req, res) => {
  res.send("Use /api/{api version}/user or /api/{api version}/tool");
});

module.exports = router;
