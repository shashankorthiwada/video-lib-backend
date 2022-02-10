require("dotenv").config();
const { User } = require("../models/user.model");
const { extend } = require("lodash");
const { hash, genSalt, compare } = require("bcrypt");
const { sign, verify } = require("jsonwebtoken");

const secret = process.env.secret;

const getUsers = async (req, res) => {
  try {
    let users = await User.find({});
    users = users.map((user) => {
      user.password = undefined;
      return user;
    });
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "error fetching user Details",
      errorMessage: error.message,
    });
  }
};

const findUser = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user) {
    const validPassword = await compare(password, user.password);
    if (validPassword) {
      const token = sign({ _id: user._id }, secret, { expiresIn: "24h" });
      res.json({
        success: true,
        user: { _id: user._id, name: user.username },
        token,
      });
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
        message: "Username is taken.",
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
    const salt = await genSalt(10);
    newUser.password = await hash(newUser.password, salt);
    newUser = await newUser.save();
    const token = sign({ _id: newUser._id }, secret, { expiresIn: "24h" });
    const user = { _id: newUser._id, name: newUser.username };
    res.status(201).json({ success: true, user, token });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to add new user",
      errorMessage: error.message,
    });
  }
};

const verifyUser = (req, userId) => {
  const token = req?.headers?.authorization;
  try {
    if (token) {
      const decodedValue = verify(token, secret);
      if (userId === decodedValue._id) {
        return true;
      }
    }
  } catch (error) {
    console.log("Error verifying JWT token");
  }
  return false;
};

const findUserById = async (req, res, next, userId) => {
  if (verifyUser(req, userId)) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw Error("unable to fetch the user details");
      }
      req.user = user;
      next();
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Unable to retrive the user details",
      });
    }
  } else {
    res.status(401).json({
      success: false,
      data: null,
      message: "UnAuthorized user or user token expired..",
    });
    throw Error("UnAuthorized user or user token expired..");
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
