const express = require("express");
const { adminAuth } = require("./middlewares/auth");
const { connectDB } = require("./config/database");
const { User } = require("./models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  const { firstName, lastName, emailId, gender, age, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);

  const user = new User({
    firstName,
    lastName,
    emailId,
    gender,
    age,
    password: passwordHash,
  });
  try {
    await user.save();
    res.send("User saved successfully");
  } catch (err) {
    res.status(400).send(err);
  }
});

app.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    if (!validator.isEmail(emailId)) throw new Error("Email ID not valid");
    const user = await User.findOne({ emailId });
    if (!user) throw new Error("Email not found. Use a valid email.");
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      const token = jwt.sign({ _id: user._id }, "balleballe");
      res.cookie("token", token);
      res.send("User logged in successfully");
    } else throw new Error("Wrong password");
  } catch (error) {
    res.status(400).send(error.message);
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
  try {
    const { token } = req.cookies;
    if (!token) throw new Error("Token not found");

    const { _id } = await jwt.verify(token, "balleballe");
    const user = await User.findOne({ _id });
    if (!user) throw new Error("User not found");

    res.send(user);
  } catch (err) {
    res.status(400).send(err.message);
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
  const userId = req.params.userId;
  const data = req.body;
  const ALLOWED_UPDATES = ["password", "age", "skills", "emailId"];
  try {
    const isAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k),
    );
    if (data?.skills?.length > 10)
      throw new Error("Skills cannot be more than 10");
    if (!isAllowed) {
      throw new Error("Other fields are not allowed");
    }
    const updatedUser = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send(updatedUser);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

connectDB()
  .then(() => {
    console.log("DB connected");
    app.listen(3000, () => console.log("Server started on port 3000"));
  })
  .catch((err) => console.log(err));
