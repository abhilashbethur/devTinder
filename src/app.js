const express = require("express");
const { adminAuth } = require("./middlewares/auth");
const { connectDB } = require("./config/database");
const { User } = require("./models/user");

const app = express();

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "Abhilash1",
    lastName: "B",
    age: 28,
    emailId: "a@b.com",
    password: "shakalaka",
    gender: "male",
  });

  try {
    await user.save();
    res.send("User saved successfully");
  } catch (err) {
    res.status(400).send("error: ", err);
  }
});

connectDB()
  .then(() => {
    console.log("DB connected");
    app.listen(3000, () => console.log("Server started on port 3000"));
  })
  .catch((err) => console.log(err));
