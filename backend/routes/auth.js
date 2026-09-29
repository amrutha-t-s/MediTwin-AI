const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const prisma = require("../prismaClient");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";

// ======================================================
// POST /api/auth/register
// ======================================================

router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword, role, termsAccepted } =
      req.body;

    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    if (!termsAccepted) {
      return res.status(400).json({
        message: "You must accept the terms and consent",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        fullName: fullName.trim(),
        email: normalizedEmail,
        passwordHash,
        role: role || "patient",
      },
    });

    // Create consent record if model exists
    try {
      if (prisma.consent) {
        await prisma.consent.create({
          data: {
            userId: user.id,
            consentType: "terms_and_privacy",
            granted: true,
            version: "1.0",
            grantedAt: new Date(),
          },
        });
      }
    } catch (consentErr) {
      console.warn("Consent creation warning:", consentErr.message);
    }

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
      error: error.message,
    });
  }
});

// ======================================================
// POST /api/auth/signup
// ======================================================

router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: "Password must be at least 8 characters",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existing = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (existing) {
      return res.status(400).json({
        error: "Email already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash: passwordHash,
      },
    });

    return res.status(201).json({
      message: "Account created successfully",
      id: user.id,
      email: user.email,
    });
  } catch (error) {
    console.error("Signup error:", error);

    return res.status(500).json({
      error: "Something went wrong",
    });
  }
});

// ======================================================
// POST /api/auth/login
// ======================================================

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    return res.status(200).json({
      message: "Login successful",

      token,

      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      error: "Login failed",
    });
  }
});

// ======================================================
// POST /api/auth/forgot-password
// ======================================================

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: "Email is required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    // Do not reveal whether email exists
    if (!user) {
      return res.status(200).json({
        message:
          "If an account with this email exists, a password reset link has been generated.",
      });
    }

    // Generate secure random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Token expires in 15 minutes
    const resetPasswordExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // Store token in database
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpiresAt: resetPasswordExpiresAt,
      },
    });

    // Student demo reset link
    const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;

    console.log("");
    console.log("==========================================");
    console.log("       MEDI TWIN PASSWORD RESET");
    console.log("==========================================");
    console.log("Email:", normalizedEmail);
    console.log("Reset Link:");
    console.log(resetLink);
    console.log("Expires in: 15 minutes");
    console.log("==========================================");
    console.log("");

    return res.status(200).json({
      message:
        "If an account with this email exists, a password reset link has been generated.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return res.status(500).json({
      error: "Unable to process password reset request",
    });
  }
});

// ======================================================
// POST /api/auth/reset-password
// ======================================================

router.post("/reset-password", async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;

    if (!token || !password || !confirmPassword) {
      return res.status(400).json({
        error: "Token, password and confirm password are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: "Password must be at least 8 characters",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        error: "Passwords do not match",
      });
    }

    // Find valid token
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return res.status(400).json({
        error: "Invalid or expired reset token",
      });
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(password, 10);

    // Update password and invalidate reset token
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        passwordHash: passwordHash,

        resetPasswordToken: null,

        resetPasswordExpiresAt: null,
      },
    });

    return res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return res.status(500).json({
      error: "Unable to reset password",
    });
  }
});

module.exports = router;
