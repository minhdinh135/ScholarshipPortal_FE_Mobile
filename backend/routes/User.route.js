const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");

router.post("/register", UserController.RegisterUser);

router.post("/login", UserController.LoginUser);

router.get("/:userId", UserController.UserList);

router.post("/friend-request", UserController.SendFriendRequest);

router.get("/friend-request/:userId", UserController.FriendRequestList);

router.post("/friend-request/accept", UserController.AcceptFriendRequest);

router.get("/accepted-friends/:userId", UserController.FriendList);

router.get("/user/:userId", UserController.RecepientUser);

router.get("/friend-requests/sent/:userId", UserController.FriendRequestSent);

router.get("/friends/:userId", UserController.FriendsUser);

module.exports = router;