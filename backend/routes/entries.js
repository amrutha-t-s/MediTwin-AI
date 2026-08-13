const express = require("express");
const prisma = require("../prismaClient");
const auth = require("../middleware/auth");

const router = express.Router();

// POST /api/entries - create a new daily entry
router.post("/", auth, async (req, res) => {
  try {
    const {
      date,
      glucose,
      bpSystolic,
      bpDiastolic,
      foodSummary,
      sleepHours,
      steps,
      medsTaken,
      alcoholUnits,
      notes,
    } = req.body;

    const entry = await prisma.dailyEntry.create({
      data: {
        userId: req.userId,
        date: new Date(date),
        glucose: glucose ? Number(glucose) : null,
        bpSystolic: bpSystolic ? Number(bpSystolic) : null,
        bpDiastolic: bpDiastolic ? Number(bpDiastolic) : null,
        foodSummary: foodSummary || null,
        sleepHours: sleepHours ? Number(sleepHours) : null,
        steps: steps ? Number(steps) : null,
        medsTaken: medsTaken ? true : false,
        alcoholUnits: alcoholUnits ? Number(alcoholUnits) : null,
        notes: notes || null,
      },
    });

    res.json(entry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

// GET /api/entries - list entries for current user
router.get("/", auth, async (req, res) => {
  try {
    const { start, end } = req.query;

    const where = { userId: req.userId };

    if (start && end) {
      where.date = {
        gte: new Date(start),
        lte: new Date(end),
      };
    }

    const entries = await prisma.dailyEntry.findMany({
      where,
      orderBy: { date: "asc" },
    });

    res.json(entries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

module.exports = router;
