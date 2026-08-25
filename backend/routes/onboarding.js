const express = require("express");
const prisma = require("../prismaClient");

const router = express.Router();

/*
==================================================
POST /api/onboarding
Save onboarding information
==================================================
*/

router.post("/", async (req, res) => {
  try {
    const {
      userId,

      // Step 1
      dateOfBirth,
      gender,
      heightCm,
      weightKg,
      location,

      // Step 2
      diabetesStatus,
      diabetesType,
      diagnosisYear,
      hba1c,
      fastingGlucose,

      // Step 3
      bloodPressureHistory,
      cholesterol,
      kidneyHistory,
      heartHistory,
      otherConditions,

      // Step 4
      smoking,
      alcohol,
      typicalSleep,
      typicalActivity,
      foodPreference,
    } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: "User ID is required",
      });
    }

    // Check user exists
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const profile = await prisma.healthProfile.upsert({
      where: {
        userId: userId,
      },

      create: {
        userId,

        // Step 1
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender: gender || null,
        heightCm: heightCm ? Number(heightCm) : null,
        weightKg: weightKg ? Number(weightKg) : null,
        location: location || null,

        // Step 2
        diabetesStatus: diabetesStatus || null,
        diabetesType: diabetesType || null,
        diagnosisYear: diagnosisYear ? Number(diagnosisYear) : null,
        hba1c: hba1c ? Number(hba1c) : null,
        fastingGlucose: fastingGlucose ? Number(fastingGlucose) : null,

        // Step 3
        bloodPressureHistory: bloodPressureHistory || null,
        cholesterol: cholesterol || null,
        kidneyHistory: kidneyHistory || null,
        heartHistory: heartHistory || null,
        otherConditions: otherConditions || null,

        // Step 4
        smoking: smoking || null,
        alcohol: alcohol || null,
        typicalSleep: typicalSleep ? Number(typicalSleep) : null,
        typicalActivity: typicalActivity || null,
        foodPreference: foodPreference || null,
      },

      update: {
        // Step 1
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender: gender || null,
        heightCm: heightCm ? Number(heightCm) : null,
        weightKg: weightKg ? Number(weightKg) : null,
        location: location || null,

        // Step 2
        diabetesStatus: diabetesStatus || null,
        diabetesType: diabetesType || null,
        diagnosisYear: diagnosisYear ? Number(diagnosisYear) : null,
        hba1c: hba1c ? Number(hba1c) : null,
        fastingGlucose: fastingGlucose ? Number(fastingGlucose) : null,

        // Step 3
        bloodPressureHistory: bloodPressureHistory || null,
        cholesterol: cholesterol || null,
        kidneyHistory: kidneyHistory || null,
        heartHistory: heartHistory || null,
        otherConditions: otherConditions || null,

        // Step 4
        smoking: smoking || null,
        alcohol: alcohol || null,
        typicalSleep: typicalSleep ? Number(typicalSleep) : null,
        typicalActivity: typicalActivity || null,
        foodPreference: foodPreference || null,
      },
    });

    res.status(200).json({
      message: "Onboarding completed successfully",
      profile,
    });
  } catch (error) {
    console.error("Onboarding error:", error);

    res.status(500).json({
      error: "Failed to save onboarding information",
    });
  }
});

/*
==================================================
GET /api/onboarding/:userId
Get onboarding information
==================================================
*/

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const profile = await prisma.healthProfile.findUnique({
      where: {
        userId,
      },
    });

    if (!profile) {
      return res.status(404).json({
        error: "Onboarding profile not found",
      });
    }

    res.json(profile);
  } catch (error) {
    console.error("Get onboarding error:", error);

    res.status(500).json({
      error: "Failed to fetch onboarding information",
    });
  }
});

module.exports = router;
