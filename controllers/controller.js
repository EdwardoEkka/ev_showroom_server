const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Assuming you have a User model
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");
const config = require("../config");
const Contact = require("../models/Contact");
const Bookings = require("../models/Vehicle");

// Route to save user data
exports.addUser = async (req, res) => {
  try {
    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      // Update the name if provided in the request body
      if (req.body.name) {
        existingUser.name = req.body.name;
        await existingUser.save();
      }
      const token = jwt.sign({ userId: existingUser._id }, config.jwtSecret, {
        expiresIn: "24h",
      });

      // Return user data along with message and token
      return res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: existingUser._id,
          name: existingUser.name,
          email: existingUser.email,
        },
      });
    }

    // Create a new user instance with data from request body
    const newUser = new User(req.body);

    // Save the user to the database
    await newUser.save();

    // Send a success response
    const token = jwt.sign({ userId: newUser._id }, config.jwtSecret, {
      expiresIn: "24h",
    });

    // Return user data along with message and token
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    // If an error occurs, send an error response
    console.error("Error saving/updating user data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.manualSignUp = async (req, res) => {
  try {
    // Extracting data from the request body
    const { name, email, password } = req.body;

    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user instance
    const newUser = new User({
      name,
      email,
      password: hashedPassword, // Password should be hashed before saving to the database for security
    });

    // Save the new user to the database
    await newUser.save();

    res.status(200).json({ message: "Sign in successful" });
  } catch (error) {
    console.error("Error signing up:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.Manual_login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token for authentication
    const token = jwt.sign({ userId: user._id }, config.jwtSecret, {
      expiresIn: "24h",
    });

    // Return user data along with message and token
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      // Add more fields as needed
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.contact_us = async (req, res) => {
  try {
    // Create a new instance of Contact model with form data
    const newContact = new Contact(req.body);
    // Save the new contact to the database
    await newContact.save();
    res.status(201).json({ message: "Form submitted successfully!" });
  } catch (error) {
    console.error("Error submitting form:", error);
    res
      .status(500)
      .json({ message: "Failed to submit form. Please try again later." });
  }
};

exports.book_vehicle = async (req, res) => {
  try {
    const { product, email, name, userId} = req.body;
    // Validate request body
    if (!product || !email || !name) {
      return res.status(400).json({ message: "Product, email, and name are required" });
    }

    // Check if booking already exists
    const existingBooking = await Bookings.findOne({ email, product, name, userId});
    if (existingBooking) {
      return res.status(409).json({ message: "Vehicle already booked" });
    }

    // Create a new booking
    const newBooking = new Bookings(req.body);

    // Save the new booking to the database
    await newBooking.save();

    res.status(201).json({ message: "Vehicle booked successfully!" });
  } catch (error) {
    console.error("Error booking vehicle:", error);
    res.status(500).json({ message: "Failed to book vehicle. Please try again later." });
  }
};

exports.get_Bookings = async (req,res) =>{
  try {
    const userId = req.params.userId;
    const getBook= await Bookings.find({userId:userId});
    res.json(getBook);
  } catch (error) {
    console.error("Error fetching:", error);
    res.status(500).json({ message: "Failed to fetch. Please try again later." });
  }
}

exports.delete_Booking = async (req,res)=>{
  try {
    const bookId = req.params.bookId;
    const deleteBook= await Bookings.findByIdAndDelete(bookId);
    res.status(201).json({ message: "Vehicle removed successfully!" });
  } catch (error) {
    console.error("Error removing:", error);
    res.status(500).json({ message: "Failed to remove. Please try again later." });
  }
}