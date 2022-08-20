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

app.get("/", (req, res) => {
  res.send("Welcome to the Tool Loaner App");
});

// Controllers
const userController = require("./controllers/userController");
app.use("/users", userController);

// const cvController = require("./controllers/toolController");
// app.use("/tools", cvController);

// const userController = require("./controllers/loaneeController");
// app.use("/loanee", userController);

app.listen(app.get("port"), () => {
  console.log(`🏃 on port: ${app.get("port")}, better catch it!`);
});
