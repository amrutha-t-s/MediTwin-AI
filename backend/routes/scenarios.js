const express = require("express");
const prisma = require("../prismaClient");
const auth = require("../middleware/auth");

const router = express.Router();

// POST /api/scenarios - create a new scenario
router.post("/", auth, async (req, res) => {
  try {
    const { name, description, changes } = req.body;

    const scenario = await prisma.scenario.create({
      data: {
        userId: req.userId,
        name,
        description: description || null,
        changes: JSON.stringify(changes),
      },
    });

    res.json(scenario);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

// GET /api/scenarios - list user's scenarios
router.get("/", auth, async (req, res) => {
  try {
    const scenarios = await prisma.scenario.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
    });

    res.json(scenarios);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

module.exports = router;
