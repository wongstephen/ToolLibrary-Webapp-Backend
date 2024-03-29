const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

app.set("port", process.env.PORT || 8020);

// Express Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use(bodyParser.json({ limit: "10mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

// Debugger Log Middleware
const requestLogger = require("./middleware/request_logger.js");
app.use(requestLogger);

// Custom Errors
const { handleErrors } = require("./middleware/custom_errors");
app.use(handleErrors);

console.log(process.env.NODE_ENV);

app.get("/", (req, res) => {
  res.send(
    "<h1>Visit the BorrowNinja app at <a href='https://toollibrary.wongstephenk.com/'>https://toollibrary.wongstephenk.com/</a>!!</h1>"
  );
});

// Controllers (v.0)
const userController = require("./controllers/userController");
app.use("/users", userController);
const cvController = require("./controllers/toolController");
app.use("/tools", cvController);

// new api routes
// /[version]/user or /[version]/tool
// note, routes are not pluralized
const apiController = require("./api");
app.use("/api", apiController);

// delete demos
const User = require("./models/User");
app.use("/deletedemos", async (req, res, next) => {
  try {
    const delDemo = await User.deleteMany({
      email: { $regex: /demo/i },
    });
    res.json(delDemo);
  } catch (err) {
    next(err);
  }
});

const server = app.listen(app.get("port"), () => {
  const today = new Date();
  console.log(
    `Running on port: ${app.get("port")} ${today.toLocaleString("en-US", {
      timeZone: "America/Los_Angeles",
    })}`
  );
});

module.exports = server;
