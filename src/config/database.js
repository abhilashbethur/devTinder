const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://abhilash_nn:DQlBRccq1Zs8nx51@namastenode.mrdw86u.mongodb.net/devTinder", // this is the cluster , not the database
  );
};

module.exports = { connectDB };
