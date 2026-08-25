const express = require("express");
const prisma = require("../prismaClient");
const auth = require("../middleware/auth");

const router = express.Router();

// ======================================================
// GET /api/profile
// Get current user's profile + health profile
// ======================================================

router.get("/", auth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found.",
      });
    }

    const healthProfile = await prisma.healthProfile.findUnique({
      where: {
        userId: req.userId,
      },
    });

    res.json({
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
      healthProfile: healthProfile || null,
    });
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);

    res.status(500).json({
      error: "Failed to load profile.",
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

    const healthProfile = await prisma.healthProfile.upsert({
      where: {
        userId: req.userId,
      },

      update: {
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender: gender || null,
        heightCm: heightCm ? Number(heightCm) : null,
        weightKg: weightKg ? Number(weightKg) : null,
        location: location || null,

        diabetesStatus: diabetesStatus || null,
        diabetesType: diabetesType || null,
        diagnosisYear: diagnosisYear ? Number(diagnosisYear) : null,
        hba1c: hba1c ? Number(hba1c) : null,
        fastingGlucose: fastingGlucose ? Number(fastingGlucose) : null,

        bloodPressureHistory: bloodPressureHistory || null,
        cholesterol: cholesterol || null,
        kidneyHistory: kidneyHistory || null,
        heartHistory: heartHistory || null,
        otherConditions: otherConditions || null,

        smoking: smoking || null,
        alcohol: alcohol || null,
        typicalSleep: typicalSleep ? Number(typicalSleep) : null,
        typicalActivity: typicalActivity || null,
        foodPreference: foodPreference || null,
      },

      create: {
        userId: req.userId,

        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender: gender || null,
        heightCm: heightCm ? Number(heightCm) : null,
        weightKg: weightKg ? Number(weightKg) : null,
        location: location || null,

        diabetesStatus: diabetesStatus || null,
        diabetesType: diabetesType || null,
        diagnosisYear: diagnosisYear ? Number(diagnosisYear) : null,
        hba1c: hba1c ? Number(hba1c) : null,
        fastingGlucose: fastingGlucose ? Number(fastingGlucose) : null,

        bloodPressureHistory: bloodPressureHistory || null,
        cholesterol: cholesterol || null,
        kidneyHistory: kidneyHistory || null,
        heartHistory: heartHistory || null,
        otherConditions: otherConditions || null,

        smoking: smoking || null,
        alcohol: alcohol || null,
        typicalSleep: typicalSleep ? Number(typicalSleep) : null,
        typicalActivity: typicalActivity || null,
        foodPreference: foodPreference || null,
      },
    });

    res.json({
      message: "Profile saved successfully.",
      healthProfile,
    });
  } catch (error) {
    console.error("SAVE PROFILE ERROR:", error);

    res.status(500).json({
      error: "Failed to save profile.",
    });
  }
});

module.exports = router;
