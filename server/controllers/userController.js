import User from "../models/User.js";

export const blockUser = async (req, res) => {
  try {
    const { userIdToBlock } = req.body;

    if (userIdToBlock === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot block yourself",
      });
    }

    const user = await User.findById(req.user._id);

    if (user.blockedUsers.includes(userIdToBlock)) {
      return res.status(400).json({
        message: "User already blocked",
      });
    }

    user.blockedUsers.push(userIdToBlock);
    await user.save();

    res.json({ message: "User blocked successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.user._id },
    }).select("-password");

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

