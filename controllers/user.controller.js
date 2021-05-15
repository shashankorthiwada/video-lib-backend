const { User } = require("../models/user.model");
const { extend } = require("lodash");

const getUsers = async (req, res) => {
  try {
    let users = await User.find({});
    users = users.map((user) => {
      user.password = undefined;
      return user;
    });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, errorMessage: error.message });
  }
};

const findUser = async (req, res) => {
  const { username, password } = req.body;
  const usernameExists = await User.exists({ username });
  if (usernameExists) {
    let user = await User.findOne({ username, password });
    if (user) {
      res.json({ success: true, user: { _id: user._id, name: user.username } });
    } else {
      res.status(401).json({
        success: false,
        user: null,
        message: "UserName or Password does not match",
      });
    }
  } else {
    res.status(401).json({
      success: false,
      user: null,
      message: "UserName doesn't exist",
    });
  }
};

const registerUser = async (req, res) => {
  try {
    const userData = req.body;
    const userNameExists = await User.exists({ username: userData.username });
    const emailExists = await User.exists({ email: userData.email });
    if (userNameExists) {
      res.status(409).json({
        success: false,
        message: "User With this User name already Exists",
      });
      return userNameExists;
    }
    if (emailExists) {
      res.status(409).json({
        success: false,
        message: "This email is already registered",
      });
      return emailExists;
    }
    let newUser = new User(userData);
    newUser = await newUser.save();
    const user = { _id: newUser._id, name: newUser.username };
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to add new user",
      errorMessage: error.message,
    });
  }
};

const findUserById = async (req, res, next, userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw Error("unable to fetch the user details");
    }
    req.user = user;
    next();
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Unable to retrive the user details" });
  }
};

const getUserById = async (req, res) => {
  const { user } = req;
  user.password = undefined;
  res.json({ success: true, user });
};

const updateUser = async (req, res) => {
  let { user } = req;
  const userUpdates = req.body;
  user = extend(user, userUpdates);
  user = await user.save();
  user.password = undefined;
  res.json({ success: true, user });
};

module.exports = {
  getUsers,
  findUser,
  registerUser,
  findUserById,
  getUserById,
  updateUser,
};
