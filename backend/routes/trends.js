const express = require("express");
const prisma = require("../prismaClient");
const auth = require("../middleware/auth");

const router = express.Router();

/**
 * GET /api/trends?days=7|14|30
 * Returns chronological health log time-series data for Recharts trend charts:
 * 1. Glucose over time
 * 2. Systolic and diastolic BP
 * 3. Steps per day
 * 4. Sleep duration
 * 5. Weight
 * 6. Medication adherence
 */
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.userId || req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized user" });
    }

    const daysParam = parseInt(req.query.days, 10);
    const validDays = [7, 14, 30].includes(daysParam) ? daysParam : 7;

    // Calculate date threshold for the past N days
    const now = new Date();
    const thresholdDate = new Date();
    thresholdDate.setDate(now.getDate() - validDays);
    thresholdDate.setHours(0, 0, 0, 0);

    // Fetch logs within range, ordered chronologically ascending for charts
    let logs = await prisma.dailyHealthLog.findMany({
      where: {
        userId,
        date: {
          gte: thresholdDate,
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    // If no recent records found within the strict date window,
    // fetch the latest N records so users testing older dates still see trend charts
    if (logs.length === 0) {
      const fallbackLogs = await prisma.dailyHealthLog.findMany({
        where: { userId },
        orderBy: { date: "desc" },
        take: validDays,
      });
      logs = fallbackLogs.reverse();
    }

    // Format time-series data points
    const timeSeries = logs.map((log) => {
      const d = new Date(log.date);
      const dateStr = d.toISOString().split("T")[0];
      const displayDate = d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      // Calculate medication adherence for the day
      let adherence = null;
      if (log.medicationTaken) {
        const takenStr = log.medicationTaken.toLowerCase();
        if (
          takenStr.includes("yes") ||
          takenStr.includes("taken") ||
          takenStr.includes("all")
        ) {
          adherence = 100;
        } else if (
          takenStr.includes("no") ||
          takenStr.includes("missed")
        ) {
          adherence = 0;
        } else if (takenStr.includes("partially") || takenStr.includes("some")) {
          adherence = 50;
        } else {
          adherence = 100;
        }
      } else if (log.medicationName) {
        adherence = 100;
      }

      return {
        id: log.id,
        date: dateStr,
        displayDate,
        glucose: log.glucose != null ? Number(log.glucose) : null,
        bpSystolic: log.bpSystolic != null ? Number(log.bpSystolic) : null,
        bpDiastolic: log.bpDiastolic != null ? Number(log.bpDiastolic) : null,
        heartRate: log.heartRate != null ? Number(log.heartRate) : null,
        steps: log.steps != null ? Number(log.steps) : null,
        sleepHours:
          log.sleepHours != null
            ? Number(log.sleepHours)
            : log.sleepDuration != null
            ? Number(log.sleepDuration)
            : null,
        sleepQuality: log.sleepQuality != null ? Number(log.sleepQuality) : null,
        weightKg: log.weightKg != null ? Number(log.weightKg) : null,
        adherence,
        exerciseMinutes:
          log.exerciseMinutes != null ? Number(log.exerciseMinutes) : null,
        waterLiters: log.waterLiters != null ? Number(log.waterLiters) : null,
        medicationName: log.medicationName || null,
        notes: log.notes || null,
      };
    });

    // Calculate summary statistics
    const glucoseVals = timeSeries.map((t) => t.glucose).filter((v) => v != null);
    const systolicVals = timeSeries.map((t) => t.bpSystolic).filter((v) => v != null);
    const diastolicVals = timeSeries.map((t) => t.bpDiastolic).filter((v) => v != null);
    const stepVals = timeSeries.map((t) => t.steps).filter((v) => v != null);
    const sleepVals = timeSeries.map((t) => t.sleepHours).filter((v) => v != null);
    const weightVals = timeSeries.map((t) => t.weightKg).filter((v) => v != null);
    const adherenceVals = timeSeries
      .map((t) => t.adherence)
      .filter((v) => v != null);

    const avg = (arr) =>
      arr.length > 0
        ? Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10
        : null;

    const stats = {
      avgGlucose: avg(glucoseVals),
      avgSystolic: avg(systolicVals),
      avgDiastolic: avg(diastolicVals),
      avgSteps: stepVals.length > 0 ? Math.round(stepVals.reduce((a, b) => a + b, 0) / stepVals.length) : null,
      avgSleep: avg(sleepVals),
      latestWeight: weightVals.length > 0 ? weightVals[weightVals.length - 1] : null,
      adherenceRate:
        adherenceVals.length > 0
          ? Math.round(
              (adherenceVals.reduce((a, b) => a + b, 0) / adherenceVals.length)
            )
          : null,
      totalEntries: timeSeries.length,
    };

    return res.status(200).json({
      days: validDays,
      timeSeries,
      stats,
    });
  } catch (error) {
    console.error("Trends API error:", error);
    return res.status(500).json({
      error: "Failed to retrieve trend data",
      message: error.message,
    });
  }
});

module.exports = router;
