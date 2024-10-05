// import path from "path";
// import express from "express";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import messageRouter from "./routes/Message.route.js";
// import userRouter from "./routes/User.route.js";
// import connectToMongoDB from "./database/connectMongoDB.js";
// import { app, server } from "./socket/socket.js";

// const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
// const cookieParser = require("cookie-parser");
const messageRouter = require("./routes/Message.route.js");
const userRouter = require("./routes/User.route.js");
const connectToMongoDB = require("./database/connectMongoDB.js");
const { app, server } = require("./socket/socket.js");

const PORT = process.env.PORT || 8000;

// const __dirname = path.resolve();

dotenv.config();

app.use(express.json()); // to parse the incoming requests with JSON payloads (from req.body)
// app.use(cookieParser());

app.use("/messages", messageRouter);
app.use("/users", userRouter);

// app.use(express.static(path.join(__dirname, "/frontend/dist")));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
// });

server.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server Running on port ${PORT}`);
});
