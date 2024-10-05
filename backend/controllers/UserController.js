const User = require("../models/user");

const createToken = (userId) => {
  const payload = {
    userId: userId,
  }

  const token = jwt.sign(payload, "Q$r2K6W8n!jCW%Zk", { expiresIn: "1h" });
  return token;
}

module.exports = {
  //endpoint for registration of the user
  RegisterUser: async (req, res) => {
    try {
      const { name, email, password, image } = req.body;
      const newUser = new User({ name, email, password, image });
      await newUser.save();
      res.status(200).json({ message: "User registered successfully!" })
    } catch (error) {
      console.log("Error registering user!", err);
      res.status(500).json({ message: "Error registering the user!!!" })
    }
  },

  //endpoint for logging in of that particular user
  LoginUser: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(404).json({ message: "Email and password are required!!" });
      }

      const user = await User.findOne({ email })
      if (!user) {
        return res.status(404).json({ message: "User not found!" });
      }

      if (user.password !== password) {
        return res.status(404).json({ message: "Wrong password!" });
      }

      const token = createToken(user._id);
      res.status(200).json({ token });

    } catch (error) {
      console.log("Error in finding user", error);
      res.status(500).json({ message: "Internal Server Error!!!" })
    }
  },

  //endpoint to access all the users except the user who's is currently logged in!
  UserList: async (req, res) => {
    try {
      const loggedInUserId = req.params.userId;
      const users = await User.find({ _id: { $ne: loggedInUserId } });
      res.status(200).json(users);
    } catch (err) {
      console.log("Error retrieving users", err);
      res.status(500).json({ message: "Error retrieving users" });
    }
  },

  //endpoint to send a request to a user
  SendFriendRequest: async (req, res) => {
    const { currentUserId, selectedUserId } = req.body;
    try {
      //update the recepient's friendRequestsArray!
      await User.findByIdAndUpdate(selectedUserId, {
        $push: { friendRequests: currentUserId },
      });

      //update the sender's sentFriendRequests array
      await User.findByIdAndUpdate(currentUserId, {
        $push: { sentFriendRequests: selectedUserId },
      });

      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
    }
  },

  //endpoint to show all the friend-requests of a particular user
  FriendRequestList: async (req, res) => {
    try {
      const { userId } = req.params;

      //fetch the user document based on the User id
      const user = await User.findById(userId)
        .populate("friendRequests", "name email image")
        .lean();

      const friendRequests = user.friendRequests;

      res.json(friendRequests);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  //endpoint to accept a friend-request of a particular person
  AcceptFriendRequest: async (req, res) => {
    try {
      const { senderId, recepientId } = req.body;

      //retrieve the documents of sender and the recipient
      const sender = await User.findById(senderId);
      const recepient = await User.findById(recepientId);

      sender.friends.push(recepientId);
      recepient.friends.push(senderId);

      recepient.friendRequests = recepient.friendRequests.filter(
        (request) => request.toString() !== senderId.toString()
      );

      sender.sentFriendRequests = sender.sentFriendRequests.filter(
        (request) => request.toString() !== recepientId.toString
      );

      await sender.save();
      await recepient.save();

      res.status(200).json({ message: "Friend Request accepted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  //endpoint to access all the friends of the logged in user!
  FriendList: async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId).populate(
        "friends",
        "name email image"
      );
      const acceptedFriends = user.friends;
      res.json(acceptedFriends);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  ///endpoint to get the userDetails to design the chat Room header
  RecepientUser: async (req, res) => {
    try {
      const { userId } = req.params;
      //fetch the user data from the user ID
      const recepientId = await User.findById(userId);

      res.json(recepientId);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  FriendRequestSent: async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId).populate("sentFriendRequests", "name email image").lean();

      const sentFriendRequests = user.sentFriendRequests;

      res.json(sentFriendRequests);
    } catch (error) {
      console.log("error", error);
      res.status(500).json({ error: "Internal Server" });
    }
  },

  FriendsUser: async (req, res) => {
    try {
      const { userId } = req.params;

      User.findById(userId).populate("friends").then((user) => {
        if (!user) {
          return res.status(404).json({ message: "User not found" })
        }

        const friendIds = user.friends.map((friend) => friend._id);

        res.status(200).json(friendIds);
      })
    } catch (error) {
      console.log("error", error);
      res.status(500).json({ message: "internal server error" })
    }
  },
}