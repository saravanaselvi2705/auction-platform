import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import generateToken from "../utils/generateToken.js";
import sendEmail from "../utils/sendEmail.js";

// =======================
// Register User
// =======================
export const registerUser = async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, password, role, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// Login User
// =======================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT Token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profileImage: user.profileImage,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// Get Profile
// =======================
export const getProfile = async (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      phone: req.user.phone,
      profileImage: req.user.profileImage,
    },
  });
};

// Forgot Password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with this email",
      });
    }

    // Token expires in 15 minutes
    const tokenSecret = process.env.JWT_SECRET + user.password;
    const token = jwt.sign({ id: user._id, email: user.email }, tokenSecret, {
      expiresIn: "15m",
    });

    const resetUrl = `${req.get("origin")}/reset-password/${token}`;

    const emailHtml = `
      <div style="font-family: 'Playfair Display', Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; border: 1px solid #eaeaea; background-color: #faf9f6; color: #111111;">
        <div style="text-align: center; margin-bottom: 40px; border-bottom: 1px solid #eaeaea; padding-bottom: 20px;">
          <h2 style="font-size: 28px; font-weight: 900; letter-spacing: -0.5px; margin: 0;">🏆 AuctionHub</h2>
          <p style="font-family: Arial, sans-serif; font-size: 12px; color: #666666; margin-top: 5px; text-transform: uppercase; letter-spacing: 2px;">Luxury Auctions</p>
        </div>
        
        <h3 style="font-size: 22px; font-weight: 800; margin-bottom: 20px;">Password Reset Request</h3>
        
        <p style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #333333;">
          We received a request to reset your password. Click the button below to secure your account. This link will expire in <strong>15 minutes</strong>.
        </p>
        
        <div style="text-align: center; margin: 40px 0;">
          <a href="${resetUrl}" style="background-color: #111111; color: #ffffff; text-decoration: none; padding: 14px 28px; font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; border-radius: 0px; display: inline-block; letter-spacing: 1px;">
            RESET PASSWORD
          </a>
        </div>
        
        <p style="font-family: Arial, sans-serif; font-size: 12px; color: #777777; line-height: 1.5; margin-top: 40px;">
          If you did not request a password reset, please ignore this email. Your password will remain unchanged.
        </p>
        
        <div style="margin-top: 40px; border-top: 1px solid #eaeaea; padding-top: 20px; text-align: center; font-family: Arial, sans-serif; font-size: 11px; color: #999999;">
          &copy; ${new Date().getFullYear()} AuctionHub. All rights reserved.
        </div>
      </div>
    `;

    await sendEmail(
      user.email,
      "Password Reset Link - AuctionHub",
      `To reset your password, please click this link: ${resetUrl}`,
      emailHtml
    );

    res.status(200).json({
      success: true,
      message: "Reset link sent to your email successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const decoded = jwt.decode(token);
    if (!decoded || !decoded.id) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired password reset token",
      });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const tokenSecret = process.env.JWT_SECRET + user.password;
    try {
      jwt.verify(token, tokenSecret);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Password reset link is invalid or has expired",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully. You can now login with your new password.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Profile
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { name, phone, profileImage } = req.body;

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (profileImage !== undefined) user.profileImage = profileImage;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};