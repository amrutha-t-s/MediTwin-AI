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
      sleep,
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

    const journal = await prisma.dailyHealthLog.create({
      data: {
        userId: req.user.userId,

        date: new Date(date),

        glucose: glucose !== "" && glucose != null ? Number(glucose) : null,

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
