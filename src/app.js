const express = require("express");

const app = express();

app.get("/user/:userId/:username/", (req, res) => {
  res.send({ msg: req.params });
});

app.get("/middle", (req, res, next) => {
  console.log("1st");
  next();
});

app.get("/middle", (req, res, next) => {
  console.log("2nd");
  res.send("hallelujah");
});

app.use("/", (req, res) => {
  res.send("Bandya ");
});

app.listen(3000, () => console.log("Server started on port 3000"));
