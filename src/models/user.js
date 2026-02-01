const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 20,
    },
    lastName: {
      type: String,
      minLength: 4,
      maxLength: 20,
    },
    age: {
      type: Number,
      min: 16,
      max: 60,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      validate: (val) => {
        if (!["male", "female"].includes(val)) {
          throw new Error("invalid gender");
        }
      },
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

module.exports = { User };
