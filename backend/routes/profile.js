const express = require("express");
const prisma = require("../prismaClient");
const auth = require("../middleware/auth");

const router = express.Router();

// GET /api/profile - get current user's profile
router.get("/", auth, async (req, res) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.userId },
    });

    res.json(profile || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

// POST /api/profile - create or update profile
router.post("/", auth, async (req, res) => {
  try {
    const {
      age,
      sex,
      heightCm,
      weightKg,
      conditions,
      medications,
      familyHistory,
    } = req.body;

    const profile = await prisma.profile.upsert({
      where: { userId: req.userId },
      update: {
        age,
        sex,
        heightCm,
        weightKg,
        conditions,
        medications,
        familyHistory,
      },
      create: {
        userId: req.userId,
        age,
        sex,
        heightCm,
        weightKg,
        conditions,
        medications,
        familyHistory,
      },
    });

    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

module.exports = router;
