const express = require("express");
const { adminAuth } = require("./middlewares/auth");
const { connectDB } = require("./config/database");
const { User } = require("./models/user");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  console.log(req.body);
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User saved successfully");
  } catch (err) {
    res.status(400).send("error: ", err);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length) res.send(users);
    else res.status(400).send("Unsuccessful query");
  } catch (err) {
    res.status(400).send("Unsuccessful query");
  }
});

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    console.log(userEmail);
    const users = await User.find({ emailId: userEmail });
    console.log(users);
    if (users.length) res.send(users);
    else res.status(400).send("Unsuccessful query");
  } catch (err) {
    res.status(400).send("Unsuccessful query");
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (error) {
    res.send(error);
  }
});

app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, data);
    res.send(updatedUser);
  } catch (error) {
    console.log(error);
  }
});

connectDB()
  .then(() => {
    console.log("DB connected");
    app.listen(3000, () => console.log("Server started on port 3000"));
  })
  .catch((err) => console.log(err));
