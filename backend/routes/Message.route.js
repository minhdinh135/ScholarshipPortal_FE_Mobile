const express = require("express");
const MessageController = require("../controllers/MessageController");
const router = express.Router();
const multer = require("multer");

// Configure multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "files/"); // Specify the desired destination folder
  },
  filename: function (req, file, cb) {
    // Generate a unique filename for the uploaded file
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/", upload.single("imageFile"), MessageController.SendMessage);

router.get("/:senderId/:recepientId", MessageController.getMessage);

router.post("/deleteMessages", MessageController.deleteMessage);

module.exports = router;