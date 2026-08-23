const express = require("express");
const prisma = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/*
  GET /api/profile
  Protected route
*/
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.userId,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Profile error:", error);

    return res.status(500).json({
      message: "Failed to fetch profile",
    });
  }
});

module.exports = router;
