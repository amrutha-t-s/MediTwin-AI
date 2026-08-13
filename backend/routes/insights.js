const express = require("express");
const prisma = require("../prismaClient");
const auth = require("../middleware/auth");

const router = express.Router();

// GET /api/insights - simple rule-based insights
router.get("/", auth, async (req, res) => {
  try {
    const entries = await prisma.dailyEntry.findMany({
      where: { userId: req.userId },
      orderBy: { date: "desc" },
      take: 30,
    });

    const insights = [];

    const recent = entries.slice(0, 7);

    const glucoseValues = recent
      .filter((e) => e.glucose != null)
      .map((e) => e.glucose);
    if (glucoseValues.length > 0) {
      const avgGlucose =
        glucoseValues.reduce((a, b) => a + b, 0) / glucoseValues.length;
      if (avgGlucose > 180) {
        insights.push(
          "Your average glucose this week is high. Consider reviewing diet and activity.",
        );
      } else if (avgGlucose <= 140) {
        insights.push(
          "Your glucose levels look within a healthy range this week.",
        );
      }
    }

    const sleepValues = recent
      .filter((e) => e.sleepHours != null)
      .map((e) => e.sleepHours);
    if (sleepValues.length > 0) {
      const avgSleep =
        sleepValues.reduce((a, b) => a + b, 0) / sleepValues.length;
      if (avgSleep < 6.5) {
        insights.push(
          "You’re averaging less than 6.5 hours of sleep. Better sleep can improve glucose control.",
        );
      } else if (avgSleep >= 7 && avgSleep <= 9) {
        insights.push("Your sleep duration looks good this week.");
      }
    }

    const highBP = recent.filter(
      (e) =>
        (e.bpSystolic != null && e.bpSystolic > 140) ||
        (e.bpDiastolic != null && e.bpDiastolic > 90),
    ).length;

    if (highBP > 2) {
      insights.push(
        "Several high BP readings this week. Monitor and discuss with your doctor.",
      );
    }

    res.json({ insights });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

module.exports = router;
