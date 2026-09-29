const express = require("express");
const prisma = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ======================================================
// CREATE DAILY HEALTH JOURNAL
// POST /api/journal
// ======================================================

router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      date,
      glucose,
      systolicBP,
      diastolicBP,
      pulseRate,
      weight,
      waistCircumference,
      steps,
      exerciseMinutes,
      exerciseType,
      sittingHours,
      sleepStartTime,
      wakeUpTime,
      sleepDuration,
      sleep,
      sleepQuality,
      nightAwakenings,
      breakfast,
      lunch,
      dinner,
      snacks,
      medication,
      water,
      smoking,
      alcohol,
      notes,
    } = req.body;

    if (!date) {
      return res.status(400).json({
        message: "Date is required",
      });
    }

    const foodSummary = [
      breakfast ? `Breakfast: ${breakfast}` : "",
      lunch ? `Lunch: ${lunch}` : "",
      dinner ? `Dinner: ${dinner}` : "",
      snacks ? `Snacks: ${snacks}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const lifestyle = [
      smoking ? `Smoking: ${smoking}` : "",
      alcohol ? `Alcohol: ${alcohol}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const finalNotes = [
      medication ? `Medication: ${medication}` : "",
      lifestyle,
      notes || "",
    ]
      .filter(Boolean)
      .join("\n");

    const resolvedSleepDuration =
      sleepDuration !== "" && sleepDuration != null
        ? Number(sleepDuration)
        : sleep !== "" && sleep != null
        ? Number(sleep)
        : null;

    const journal = await prisma.dailyHealthLog.create({
      data: {
        userId: req.user.userId,

        date: new Date(date),

        // Day 16 - Glucose
        glucose: glucose !== "" && glucose != null ? Number(glucose) : null,

        // Day 17 - BP & Vitals
        bpSystolic:
          systolicBP !== "" && systolicBP != null ? Number(systolicBP) : null,

        bpDiastolic:
          diastolicBP !== "" && diastolicBP != null
            ? Number(diastolicBP)
            : null,

        heartRate:
          pulseRate !== "" && pulseRate != null ? Number(pulseRate) : null,

        weightKg: weight !== "" && weight != null ? Number(weight) : null,

        waistCircumference:
          waistCircumference !== "" && waistCircumference != null
            ? Number(waistCircumference)
            : null,

        // Day 18 - Activity
        steps: steps !== "" && steps != null ? Number(steps) : null,

        exerciseMinutes:
          exerciseMinutes !== "" && exerciseMinutes != null
            ? Number(exerciseMinutes)
            : null,

        exerciseType: exerciseType || null,

        sittingHours:
          sittingHours !== "" && sittingHours != null
            ? Number(sittingHours)
            : null,

        exercise:
          exerciseType ||
          (exerciseMinutes ? `${exerciseMinutes} mins` : null),

        // Day 18 - Sleep
        sleepStartTime: sleepStartTime || null,

        wakeUpTime: wakeUpTime || null,

        sleepDuration: resolvedSleepDuration,

        sleepHours: resolvedSleepDuration,

        sleepQuality:
          sleepQuality !== "" && sleepQuality != null
            ? Number(sleepQuality)
            : null,

        nightAwakenings:
          nightAwakenings !== "" && nightAwakenings != null
            ? Number(nightAwakenings)
            : null,

        // Food & Lifestyle
        waterLiters: water !== "" && water != null ? Number(water) : null,

        foodSummary: foodSummary || null,

        notes: finalNotes || null,
      },
    });

    console.log("Journal saved successfully:", journal.id);

    return res.status(201).json({
      message: "Daily health journal saved successfully",
      journal,
    });
  } catch (error) {
    console.error("Journal save error:", error);

    return res.status(500).json({
      message: "Failed to save daily health journal",
      error: error.message,
    });
  }
});

// ======================================================
// GET DAILY HEALTH JOURNALS
// GET /api/journal
// ======================================================

router.get("/", authMiddleware, async (req, res) => {
  try {
    const journals = await prisma.dailyHealthLog.findMany({
      where: {
        userId: req.user.userId,
      },
      orderBy: {
        date: "desc",
      },
    });

    return res.status(200).json(journals);
  } catch (error) {
    console.error("Journal fetch error:", error);

    return res.status(500).json({
      message: "Failed to fetch daily health journals",
      error: error.message,
    });
  }
});

module.exports = router;
