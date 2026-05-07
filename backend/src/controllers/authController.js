const asyncHandler = require("../utils/asyncHandler");
const HttpError = require("../utils/httpError");

const Student = require("../models/Student");

const generateToken = require("../utils/generateToken");


// REGISTER
const register = asyncHandler(async (req, res) => {

  const {
    fullName,
    email,
    password,
    role,
  } = req.body;

  // check if user exists
  const existingUser = await Student.findOne({ email });

  if (existingUser) {
    throw new HttpError(400, "User already exists.");
  }

  // create user
  const user = await Student.create({
    fullName,
    email,
    password,
    role,
  });

  // generate token
  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    token,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
  });
});



// LOGIN
const login = asyncHandler(async (req, res) => {

  const { email, password } = req.body;

  // find user
  const user = await Student.findOne({ email });

  if (!user) {
    throw new HttpError(401, "Invalid email or password.");
  }

  // compare password
  const isPasswordCorrect =
    await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new HttpError(401, "Invalid email or password.");
  }

  // generate token
  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    token,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
  });
});



// GET CURRENT USER
const me = asyncHandler(async (req, res) => {

  res.status(200).json({
    success: true,
    user: req.user,
  });
});


module.exports = {
  register,
  login,
  me,
};