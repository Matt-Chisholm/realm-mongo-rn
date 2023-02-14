import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

// Register User
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 1000),
      impressions: Math.floor(Math.random() * 10000),
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
    console.log("Register error : ", err);
  }
};

// Login User
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    !user && res.status(404).json("User not found");

    const validPassword = await bcrypt.compare(password, user.password);
    !validPassword && res.status(400).json("Wrong password");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "5d",
    });

    delete user.password;
    res.status(200).json({ user, token });
  } catch (err) {
    res.status(500).json(err);
    console.log("Login error : ", err);
  }
};
