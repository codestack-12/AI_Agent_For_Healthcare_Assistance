import jwt from "jsonwebtoken";
import crypto from "crypto";
import validator from "validator";
import User from "../models/User.js";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

const strongPassword = (pw) =>
  validator.isStrongPassword(pw, {
    minLength: 6,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  });

export const signup = async (req, res) => {
  try {
    const { fullName, email, phone, password, confirmPassword } = req.body;

    if (!fullName || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }
    if (!validator.isMobilePhone(phone, "any")) {
      return res.status(400).json({ message: "Invalid phone number" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    if (!strongPassword(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters and include lowercase, a number, and a symbol",
      });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "Email already registered" });

    const user = await User.create({ fullName, email, phone, password });
    const token = signToken(user._id);

    res.status(201).json({
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = signToken(user._id);
    res.json({
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

export const getMe = async (req, res) => {
  // req.user is already loaded (without password) by the `protect` middleware.
  res.json({ user: req.user });
};

const EDITABLE_FIELDS = [
  "fullName",
  "phone",
  "age",
  "gender",
  "bloodGroup",
  "medicalHistory",
  "allergies",
  "address",
  "emergencyContact",
  "preferredLanguage",
];

export const updateProfile = async (req, res) => {
  try {
    const updates = {};
    for (const field of EDITABLE_FIELDS) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    if (updates.fullName !== undefined && !updates.fullName.trim()) {
      return res.status(400).json({ message: "Full name cannot be empty" });
    }
    if (updates.phone !== undefined && !validator.isMobilePhone(updates.phone, "any")) {
      return res.status(400).json({ message: "Invalid phone number" });
    }
    if (updates.age !== undefined && updates.age !== "" && (updates.age < 0 || updates.age > 130)) {
      return res.status(400).json({ message: "Please enter a valid age" });
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile", error: err.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password are required" });
    }

    const user = await User.findById(req.user._id).select("+password");
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }
    if (!strongPassword(newPassword)) {
      return res.status(400).json({
        message: "Password must be at least 6 characters and include lowercase, a number, and a symbol",
      });
    }

    user.password = newPassword; // pre-save hook re-hashes it
    await user.save();

    res.json({ message: "Password updated" });
  } catch (err) {
    res.status(500).json({ message: "Failed to change password", error: err.message });
  }
};

export const logout = async (_req, res) => {
  // JWT is stateless; client discards the token. Endpoint kept for a consistent API surface
  // and as a hook for token-blacklisting if that's added later.
  res.json({ message: "Logged out" });
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    // Always respond the same way to avoid leaking which emails are registered
    if (!user) return res.json({ message: "If that email exists, an OTP has been sent" });

    const otp = crypto.randomInt(100000, 999999).toString();
    user.resetOtp = otp;
    user.resetOtpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // TODO: send via nodemailer using SMTP_* env vars once configured
    console.log(`[DEV ONLY] Password reset OTP for ${email}: ${otp}`);

    res.json({ message: "If that email exists, an OTP has been sent" });
  } catch (err) {
    res.status(500).json({ message: "Request failed", error: err.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email }).select("+resetOtp +resetOtpExpires +password");

    if (!user || user.resetOtp !== otp || user.resetOtpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    if (!strongPassword(newPassword)) {
      return res.status(400).json({
        message: "Password must be at least 8 characters and include uppercase, lowercase, a number, and a symbol",
      });
    }

    user.password = newPassword;
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: "Reset failed", error: err.message });
  }
};
