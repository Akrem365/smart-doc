import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import {
  BadRequestError,
  NotFoundError,
  UnAuthenticatedError,
} from "../errors/index.js";
const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      registrationNumber,
      role,
      lastName,
      location,
    } = req.body;
    if (
      !name ||
      !email ||
      !password ||
      !registrationNumber ||
      !role ||
      !lastName ||
      !location
    ) {
      throw new BadRequestError("Please provide all values");
    }

    console.log("Checking if user already exists with email:", email);
    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      console.log("User already exists with email:", email);
      throw new BadRequestError("Email already in use");
    }

    console.log("Creating new user with email:", email);
    const user = await User.create({
      name,
      email,
      password,
      registrationNumber,
      role,
      isApproved: false,
      lastName,
      location,
    });
    const token = user.createJWT();
    console.log("User created successfully with email:", email);

    res.status(StatusCodes.CREATED).json({
      user: {
        email: user.email,
        lastName: user.lastName,
        location: user.location,
        name: user.name,
        registrationNumber: user.registrationNumber,
        role: user.role,
        isApproved: user.isApproved,
      },
      token,

      location: user.location,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(StatusCodes.BAD_REQUEST).json({ msg: error.message });
  }
};
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide all values");
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new UnAuthenticatedError("Invalid Credentials");
  }
  console.log(user);
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError("Invalid Credentials");
  }
  const token = user.createJWT();
  user.password = undefined;
  res.status(StatusCodes.OK).json({
    user,
    token,
    location: user.location,
  });
};
const updateUser = async (req, res) => {
  const { email, name, location, lastName } = req.body;
  if (!email || !name || !lastName || !location) {
    throw new BadRequestError("Please provide all values");
  }
  const user = await User.findOne({ _id: req.user.userId });
  user.email = email;
  user.name = name;
  user.location = location;
  user.lastName = lastName;

  await user.save();

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user, token, location: user.location });
};
const updateUserApproval = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { isApproved } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      throw new BadRequestError("User not found");
    }

    user.isApproved = isApproved;
    await user.save();

    res.status(StatusCodes.OK).json({
      message: "User approval status updated successfully",
      user: {
        email: user.email,
        lastName: user.lastName,
        location: user.location,
        name: user.name,
        registrationNumber: user.registrationNumber,
        role: user.role,
        isApproved: user.isApproved,
      },
    });
  } catch (error) {
    console.error("Error updating user approval status:", error);
    res.status(StatusCodes.BAD_REQUEST).json({ msg: error.message });
  }
};
const getAllUerNotApproved = async (req, res) => {
  const notApproved = await User.find({ isApproved: false });
  res.status(StatusCodes.OK).json({
    notApproved,
  });
};
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.userID;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw new NotFoundError(`No user with id ${userId}`);
    }
    const userDoc = user.toObject();
    await User.deleteOne({ _id: userId });
    res.status(StatusCodes.OK).json({ msg: "Success! user removed" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(StatusCodes.BAD_REQUEST).json({ msg: error.message });
  }
};
export {
  register,
  login,
  updateUser,
  updateUserApproval,
  getAllUerNotApproved,
  deleteUser,
};
