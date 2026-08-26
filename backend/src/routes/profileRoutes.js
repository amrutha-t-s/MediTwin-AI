const express = require("express");
const prisma = require("../config/db");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// ======================================================
// GET /api/profile
// Get current user's health profile
// ======================================================

router.get("/", auth, async (req, res) => {
  try {
    const profile = await prisma.healthProfile.findUnique({
      where: {
        userId: req.userId,
      },
    });

    // User has not completed the profile yet
    if (!profile) {
      return res.status(200).json(null);
    }

    return res.status(200).json(profile);
  } catch (error) {
    console.error("Get profile error:", error);

    return res.status(500).json({
      error: "Failed to load your profile.",
    });
  }
});

// ======================================================
// GET /api/profile/me
// Get current user's health profile
// ======================================================

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await prisma.healthProfile.findUnique({
      where: {
        userId: req.userId,
      },
    });

    if (!profile) {
      return res.status(200).json(null);
    }

    return res.status(200).json(profile);
  } catch (error) {
    console.error("Get profile/me error:", error);

    return res.status(500).json({
      error: "Failed to load your profile.",
    });
  }
});

// ======================================================
// POST /api/profile
// Create or update health profile
// ======================================================

router.post("/", auth, async (req, res) => {
  try {
    const {
      dateOfBirth,
      gender,
      heightCm,
      weightKg,
      location,

      diabetesStatus,
      diabetesType,
      diagnosisYear,
      hba1c,
      fastingGlucose,

      bloodPressureHistory,
      cholesterol,
      kidneyHistory,
      heartHistory,
      otherConditions,

      smoking,
      alcohol,
      typicalSleep,
      typicalActivity,
      foodPreference,
    } = req.body;

    const profile = await prisma.healthProfile.upsert({
      where: {
        userId: req.userId,
      },

      update: {
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,

        gender: gender || null,

        heightCm:
          heightCm !== undefined && heightCm !== "" ? Number(heightCm) : null,

        weightKg:
          weightKg !== undefined && weightKg !== "" ? Number(weightKg) : null,

        location: location || null,

        diabetesStatus: diabetesStatus || null,
        diabetesType: diabetesType || null,

        diagnosisYear:
          diagnosisYear !== undefined && diagnosisYear !== ""
            ? Number(diagnosisYear)
            : null,

        hba1c: hba1c !== undefined && hba1c !== "" ? Number(hba1c) : null,

        fastingGlucose:
          fastingGlucose !== undefined && fastingGlucose !== ""
            ? Number(fastingGlucose)
            : null,

        bloodPressureHistory: bloodPressureHistory || null,
        cholesterol: cholesterol || null,
        kidneyHistory: kidneyHistory || null,
        heartHistory: heartHistory || null,
        otherConditions: otherConditions || null,

        smoking: smoking || null,
        alcohol: alcohol || null,

        typicalSleep:
          typicalSleep !== undefined && typicalSleep !== ""
            ? Number(typicalSleep)
            : null,

        typicalActivity: typicalActivity || null,
        foodPreference: foodPreference || null,
      },

      create: {
        userId: req.userId,

        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,

        gender: gender || null,

        heightCm:
          heightCm !== undefined && heightCm !== "" ? Number(heightCm) : null,

        weightKg:
          weightKg !== undefined && weightKg !== "" ? Number(weightKg) : null,

        location: location || null,

        diabetesStatus: diabetesStatus || null,
        diabetesType: diabetesType || null,

        diagnosisYear:
          diagnosisYear !== undefined && diagnosisYear !== ""
            ? Number(diagnosisYear)
            : null,

        hba1c: hba1c !== undefined && hba1c !== "" ? Number(hba1c) : null,

        fastingGlucose:
          fastingGlucose !== undefined && fastingGlucose !== ""
            ? Number(fastingGlucose)
            : null,

        bloodPressureHistory: bloodPressureHistory || null,
        cholesterol: cholesterol || null,
        kidneyHistory: kidneyHistory || null,
        heartHistory: heartHistory || null,
        otherConditions: otherConditions || null,

        smoking: smoking || null,
        alcohol: alcohol || null,

        typicalSleep:
          typicalSleep !== undefined && typicalSleep !== ""
            ? Number(typicalSleep)
            : null,

        typicalActivity: typicalActivity || null,
        foodPreference: foodPreference || null,
      },
    });

    return res.status(200).json(profile);
  } catch (error) {
    console.error("Save profile error:", error);

    return res.status(500).json({
      error: "Failed to save your profile.",
    });
  }
});

module.exports = router;
