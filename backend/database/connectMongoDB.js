const mongoose = require("mongoose");

const connectToMongoDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://dangnse173237:dangnse173237@cluster0.6nq3nal.mongodb.net/", {
      dbName: "MobileApp"
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB", error.message);
  }
};

module.exports = connectToMongoDB;