import { check, validationResult } from "express-validator";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/*----------------------------signup logic start------------------------------------------------*/ 
 

export const postSignup = [
  check("name").trim().notEmpty().withMessage("Name is required"),

  check("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Please enter a valid 10-digit Indian phone number"),

  check("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  check("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .bail()
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .bail()
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .bail()
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .bail()
    .matches(/[\W_]/)
    .withMessage("Password must contain at least one special character"),
  check("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  // 2. Main Controller Function (The Logic)
  async (req, res) => {
    // Error check karo jo validator ne bheje hain
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map((err) => err.msg),
      });
    }

    try {
      const { name, email, phone, password } = req.body;

      // Check if user already exists
      let userExists = await User.findOne({ $or: [{ email }, { phone }] });
      if (userExists) {
        return res
          .status(400)
          .json({ message: "Email or Phone already registered" });
      }

      // Password Hashing
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create User
      const user = new User({
        name,
        email,
        phone,
        password: hashedPassword,
      });

      await user.save();
      res
        .status(201)
        .json({ success: true, message: "User registered successfully!" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
];

/*-----------------------------------signup logic end------------------------------------------------*/

/*-----------------------------------login logic start------------------------------------------------*/

export const postLogin = async (req, res) => {
  console.log("login successfully");
};

export const postLogout = async (req, res) => {
  res.json({ message: "logout successfully" });
};
