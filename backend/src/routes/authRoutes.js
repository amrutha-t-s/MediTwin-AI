const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = require("../config/db");

const router = express.Router();

/*
  POST /api/auth/register
*/
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword, role, termsAccepted } =
      req.body;

    // ==========================
    // Required fields
    // ==========================

    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    // ==========================
    // Terms validation
    // ==========================

    if (!termsAccepted) {
      return res.status(400).json({
        message: "You must accept the terms and consent",
      });
    }

    // ==========================
    // Email validation
    // ==========================

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }

    // ==========================
    // Password validation
    // ==========================

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long",
      });
    }

    // ==========================
    // Confirm password
    // ==========================

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    // ==========================
    // Check duplicate email
    // ==========================

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists",
      });
    }

    // ==========================
    // Hash password
    // ==========================

    const passwordHash = await bcrypt.hash(password, 12);

    // ==========================
    // Create user
    // ==========================

    const user = await prisma.user.create({
      data: {
        fullName: fullName.trim(),
        email: email.toLowerCase(),
        passwordHash,
        role: role || "patient",
      },
    });

    // ==========================
    // Create consent record
    // ==========================

    await prisma.consent.create({
      data: {
        userId: user.id,
        consentType: "terms_and_privacy",
        granted: true,
        version: "1.0",
        grantedAt: new Date(),
      },
    });

    // ==========================
    // Registration response
    // ==========================

    return res.status(201).json({
      message: "Account created successfully",
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      message: "Registration failed",
    });
  }
});

/*
  POST /api/auth/login
*/
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // ==========================
    // Required fields
    // ==========================

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // ==========================
    // Find user
    // ==========================

    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // ==========================
    // Compare password
    // ==========================

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // ==========================
    // Create JWT
    // ==========================

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    // ==========================
    // Login response
    // ==========================

    return res.status(200).json({
      message: "Login successful",

      token,

      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Login failed",
    });
  }
});

module.exports = router;
