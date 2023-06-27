const express = require("express");
const app = express();
const cors = require("cors");

app.set("port", process.env.PORT || 8000);

// Express Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Debugger Log Middleware
const requestLogger = require("./middleware/request_logger.js");
app.use(requestLogger);

// Custom Errors
const { handleErrors } = require("./middleware/custom_errors");
app.use(handleErrors);

app.get("/", (req, res) => {
  res.send(
    "<h1>Visit the Tool Library app at <a href='https://toollibrary.wongstephenk.com/'>https://toollibrary.wongstephenk.com/</a>!!</h1>"
  );
});

// Controllers
const userController = require("./controllers/userController");
app.use("/users", userController);

const cvController = require("./controllers/toolController");
app.use("/tools", cvController);

const server = app.listen(app.get("port"), () => {
  console.log(`🏃 on port: ${app.get("port")}, better catch it!`);
});

module.exports = server;
