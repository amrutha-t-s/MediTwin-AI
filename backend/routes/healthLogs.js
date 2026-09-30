const express = require("express");
const prisma = require("../prismaClient");
const auth = require("../middleware/auth");

const router = express.Router();

/**
 * Normalizes input date to start and end of that calendar day in UTC.
 */
function getDateBounds(dateInput) {
  if (!dateInput) return null;
  let dateStr;
  if (typeof dateInput === "string") {
    dateStr = dateInput.split("T")[0];
  } else if (dateInput instanceof Date) {
    dateStr = dateInput.toISOString().split("T")[0];
  } else {
    dateStr = new Date(dateInput).toISOString().split("T")[0];
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const d = new Date(dateInput);
    if (Number.isNaN(d.getTime())) return null;
    dateStr = d.toISOString().split("T")[0];
  }

  const start = new Date(`${dateStr}T00:00:00.000Z`);
  const end = new Date(`${dateStr}T23:59:59.999Z`);
  return { start, end, dateStr, canonicalDate: start };
}

/**
 * Normalizes and extracts health log data from request body.
 */
function parseHealthLogData(body, userId) {
  const {
    date,
    glucose,
    systolicBP,
    bpSystolic,
    diastolicBP,
    bpDiastolic,
    pulseRate,
    heartRate,
    weight,
    weightKg,
    waistCircumference,
    steps,
    exerciseMinutes,
    exerciseType,
    exercise,
    sittingHours,
    sleepStartTime,
    wakeUpTime,
    sleepDuration,
    sleepHours,
    sleep,
    sleepQuality,
    nightAwakenings,
    water,
    waterLiters,
    smoking,
    alcohol,
    stressLevel,
    energyLevel,
    symptoms,
    mood,
    notes,
    foodSummary,
    foodDetails,
    hasSugaryDrink,
    hasFriedFood,
    isHighCarb,
    hasVegetables,
    mealSatisfaction,
    medicationName,
    medicationDosage,
    medicationFrequency,
    medicationTaken,
    missedReason,
    breakfast,
    breakfastTime,
    breakfastPortion,
    breakfastSugaryDrink,
    breakfastFriedFood,
    breakfastHighCarb,
    breakfastVegetables,
    breakfastSatisfaction,
    lunch,
    lunchTime,
    lunchPortion,
    lunchSugaryDrink,
    lunchFriedFood,
    lunchHighCarb,
    lunchVegetables,
    lunchSatisfaction,
    dinner,
    dinnerTime,
    dinnerPortion,
    dinnerSugaryDrink,
    dinnerFriedFood,
    dinnerHighCarb,
    dinnerVegetables,
    dinnerSatisfaction,
    snacks,
    snacksTime,
    snacksPortion,
    snacksSugaryDrink,
    snacksFriedFood,
    snacksHighCarb,
    snacksVegetables,
    snacksSatisfaction,
  } = body;

  const numOrNull = (val) => {
    if (val === "" || val === null || val === undefined) return null;
    const n = Number(val);
    return Number.isNaN(n) ? null : n;
  };

  const intOrNull = (val) => {
    if (val === "" || val === null || val === undefined) return null;
    const n = parseInt(val, 10);
    return Number.isNaN(n) ? null : n;
  };

  const resolvedSystolic = intOrNull(
    bpSystolic !== undefined ? bpSystolic : systolicBP
  );
  const resolvedDiastolic = intOrNull(
    bpDiastolic !== undefined ? bpDiastolic : diastolicBP
  );
  const resolvedHeartRate = intOrNull(
    heartRate !== undefined ? heartRate : pulseRate
  );
  const resolvedWeight = numOrNull(weightKg !== undefined ? weightKg : weight);
  const resolvedWater = numOrNull(
    waterLiters !== undefined ? waterLiters : water
  );
  const resolvedSleep = numOrNull(
    sleepDuration !== undefined
      ? sleepDuration
      : sleepHours !== undefined
      ? sleepHours
      : sleep
  );

  let structuredFoodDetails = foodDetails || null;
  if (!structuredFoodDetails && (breakfast || lunch || dinner || snacks)) {
    structuredFoodDetails = {
      breakfast: {
        food: breakfast || "",
        time: breakfastTime || "",
        portion: breakfastPortion || "",
        sugaryDrink: !!breakfastSugaryDrink,
        friedFood: !!breakfastFriedFood,
        highCarb: !!breakfastHighCarb,
        vegetables: !!breakfastVegetables,
        satisfaction: intOrNull(breakfastSatisfaction),
      },
      lunch: {
        food: lunch || "",
        time: lunchTime || "",
        portion: lunchPortion || "",
        sugaryDrink: !!lunchSugaryDrink,
        friedFood: !!lunchFriedFood,
        highCarb: !!lunchHighCarb,
        vegetables: !!lunchVegetables,
        satisfaction: intOrNull(lunchSatisfaction),
      },
      dinner: {
        food: dinner || "",
        time: dinnerTime || "",
        portion: dinnerPortion || "",
        sugaryDrink: !!dinnerSugaryDrink,
        friedFood: !!dinnerFriedFood,
        highCarb: !!dinnerHighCarb,
        vegetables: !!dinnerVegetables,
        satisfaction: intOrNull(dinnerSatisfaction),
      },
      snacks: {
        food: snacks || "",
        time: snacksTime || "",
        portion: snacksPortion || "",
        sugaryDrink: !!snacksSugaryDrink,
        friedFood: !!snacksFriedFood,
        highCarb: !!snacksHighCarb,
        vegetables: !!snacksVegetables,
        satisfaction: intOrNull(snacksSatisfaction),
      },
    };
  }

  let resolvedFoodSummary = foodSummary || null;
  if (!resolvedFoodSummary && (breakfast || lunch || dinner || snacks)) {
    const lines = [];
    if (breakfast) lines.push(`Breakfast: ${breakfast}`);
    if (lunch) lines.push(`Lunch: ${lunch}`);
    if (dinner) lines.push(`Dinner: ${dinner}`);
    if (snacks) lines.push(`Snacks: ${snacks}`);
    resolvedFoodSummary = lines.join("\n") || null;
  }

  const resolvedDate = date ? new Date(date) : new Date();

  return {
    userId,
    date: resolvedDate,
    glucose: numOrNull(glucose),
    bpSystolic: resolvedSystolic,
    bpDiastolic: resolvedDiastolic,
    heartRate: resolvedHeartRate,
    weightKg: resolvedWeight,
    waistCircumference: numOrNull(waistCircumference),
    sleepHours: resolvedSleep,
    sleepDuration: resolvedSleep,
    steps: intOrNull(steps),
    waterLiters: resolvedWater,
    exerciseMinutes: intOrNull(exerciseMinutes),
    exerciseType: exerciseType || null,
    sittingHours: numOrNull(sittingHours),
    exercise:
      exercise ||
      exerciseType ||
      (exerciseMinutes ? `${exerciseMinutes} mins` : null),
    sleepStartTime: sleepStartTime || null,
    wakeUpTime: wakeUpTime || null,
    sleepQuality: intOrNull(sleepQuality),
    nightAwakenings: intOrNull(nightAwakenings),
    foodSummary: resolvedFoodSummary,
    foodDetails: structuredFoodDetails,
    hasSugaryDrink:
      hasSugaryDrink !== undefined
        ? Boolean(hasSugaryDrink)
        : !!(
            breakfastSugaryDrink ||
            lunchSugaryDrink ||
            dinnerSugaryDrink ||
            snacksSugaryDrink
          ),
    hasFriedFood:
      hasFriedFood !== undefined
        ? Boolean(hasFriedFood)
        : !!(
            breakfastFriedFood ||
            lunchFriedFood ||
            dinnerFriedFood ||
            snacksFriedFood
          ),
    isHighCarb:
      isHighCarb !== undefined
        ? Boolean(isHighCarb)
        : !!(
            breakfastHighCarb ||
            lunchHighCarb ||
            dinnerHighCarb ||
            snacksHighCarb
          ),
    hasVegetables:
      hasVegetables !== undefined
        ? Boolean(hasVegetables)
        : !!(
            breakfastVegetables ||
            lunchVegetables ||
            dinnerVegetables ||
            snacksVegetables
          ),
    mealSatisfaction: intOrNull(mealSatisfaction),
    medicationName: medicationName || null,
    medicationDosage: medicationDosage || null,
    medicationFrequency: medicationFrequency || null,
    medicationTaken: medicationTaken || null,
    missedReason: missedReason || null,
    alcohol: alcohol || null,
    smoking: smoking || null,
    stressLevel: intOrNull(stressLevel),
    energyLevel: intOrNull(energyLevel),
    symptoms: symptoms || null,
    mood: mood || null,
    notes: notes || null,
  };
}

// ======================================================
// POST /api/health-logs
// Create a new daily record with duplicate prevention
// ======================================================
router.post("/", auth, async (req, res) => {
  try {
    const userId = req.userId || req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized user" });
    }

    const { date } = req.body;
    if (!date) {
      return res.status(400).json({ error: "Date is required" });
    }

    const bounds = getDateBounds(date);
    if (!bounds) {
      return res.status(400).json({
        error: "Invalid date format. Please provide a valid date.",
      });
    }

    // Check for duplicate entry on the same date for this user
    const existing = await prisma.dailyHealthLog.findFirst({
      where: {
        userId,
        date: {
          gte: bounds.start,
          lte: bounds.end,
        },
      },
    });

    if (existing) {
      return res.status(409).json({
        error: "DUPLICATE_ENTRY",
        message: `A health record for ${bounds.dateStr} already exists. Please edit the existing record instead.`,
        existingId: existing.id,
      });
    }

    const data = parseHealthLogData(req.body, userId);
    data.date = bounds.canonicalDate;

    const log = await prisma.dailyHealthLog.create({
      data,
    });

    return res.status(201).json({
      message: "Health record saved successfully",
      log,
    });
  } catch (error) {
    console.error("Error creating health log:", error);
    return res.status(500).json({
      error: "Failed to save health log",
      message: error.message,
    });
  }
});

// ======================================================
// GET /api/health-logs
// Retrieve all daily records for current user
// ======================================================
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.userId || req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized user" });
    }

    const { start, end } = req.query;
    const where = { userId };

    if (start && end) {
      where.date = {
        gte: new Date(start),
        lte: new Date(end),
      };
    }

    const logs = await prisma.dailyHealthLog.findMany({
      where,
      orderBy: {
        date: "desc",
      },
    });

    return res.status(200).json(logs);
  } catch (error) {
    console.error("Error retrieving health logs:", error);
    return res.status(500).json({
      error: "Failed to retrieve health logs",
      message: error.message,
    });
  }
});

// ======================================================
// GET /api/health-logs/:date
// Retrieve daily record by date (or ID) for current user
// ======================================================
router.get("/:date", auth, async (req, res) => {
  try {
    const userId = req.userId || req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized user" });
    }

    const { date } = req.params;

    // Check if UUID was provided
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        date
      );

    if (isUuid) {
      const logById = await prisma.dailyHealthLog.findFirst({
        where: {
          id: date,
          userId,
        },
      });

      if (!logById) {
        return res.status(404).json({
          error: "NOT_FOUND",
          message: "Health record not found",
        });
      }

      return res.status(200).json(logById);
    }

    const bounds = getDateBounds(date);
    if (!bounds) {
      return res.status(400).json({
        error: "Invalid date format. Expected YYYY-MM-DD.",
      });
    }

    const log = await prisma.dailyHealthLog.findFirst({
      where: {
        userId,
        date: {
          gte: bounds.start,
          lte: bounds.end,
        },
      },
    });

    if (!log) {
      return res.status(404).json({
        error: "NOT_FOUND",
        message: `No health record found for ${bounds.dateStr}`,
      });
    }

    return res.status(200).json(log);
  } catch (error) {
    console.error("Error retrieving health log by date:", error);
    return res.status(500).json({
      error: "Failed to retrieve health log",
      message: error.message,
    });
  }
});

// ======================================================
// PUT /api/health-logs/:id
// Update daily record by ID
// ======================================================
router.put("/:id", auth, async (req, res) => {
  try {
    const userId = req.userId || req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized user" });
    }

    const { id } = req.params;

    const existing = await prisma.dailyHealthLog.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existing) {
      return res.status(404).json({
        error: "NOT_FOUND",
        message: "Health record not found",
      });
    }

    // If date is being updated, verify it doesn't conflict with another record
    if (req.body.date) {
      const bounds = getDateBounds(req.body.date);
      if (!bounds) {
        return res.status(400).json({
          error: "Invalid date format.",
        });
      }

      const duplicate = await prisma.dailyHealthLog.findFirst({
        where: {
          userId,
          id: { not: id },
          date: {
            gte: bounds.start,
            lte: bounds.end,
          },
        },
      });

      if (duplicate) {
        return res.status(409).json({
          error: "DUPLICATE_ENTRY",
          message: `Another health record already exists for ${bounds.dateStr}. Duplicate entries are not allowed.`,
          existingId: duplicate.id,
        });
      }
    }

    const updateData = parseHealthLogData(req.body, userId);
    if (req.body.date) {
      const bounds = getDateBounds(req.body.date);
      updateData.date = bounds.canonicalDate;
    } else {
      delete updateData.date;
    }
    delete updateData.userId;

    const updated = await prisma.dailyHealthLog.update({
      where: { id },
      data: updateData,
    });

    return res.status(200).json({
      message: "Health record updated successfully",
      log: updated,
    });
  } catch (error) {
    console.error("Error updating health log:", error);
    return res.status(500).json({
      error: "Failed to update health log",
      message: error.message,
    });
  }
});

// ======================================================
// DELETE /api/health-logs/:id
// Delete daily record by ID
// ======================================================
router.delete("/:id", auth, async (req, res) => {
  try {
    const userId = req.userId || req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized user" });
    }

    const { id } = req.params;

    const existing = await prisma.dailyHealthLog.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existing) {
      return res.status(404).json({
        error: "NOT_FOUND",
        message: "Health record not found",
      });
    }

    await prisma.dailyHealthLog.delete({
      where: { id },
    });

    return res.status(200).json({
      message: "Health record deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting health log:", error);
    return res.status(500).json({
      error: "Failed to delete health log",
      message: error.message,
    });
  }
});

module.exports = router;
