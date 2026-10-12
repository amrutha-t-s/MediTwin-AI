const express = require("express");
const prisma = require("../prismaClient");
const auth = require("../middleware/auth");

const router = express.Router();

// ============================================================================
// PROHIBITED KEYWORDS ENFORCEMENT
// Strict compliance: "Do not simulate insulin or medication changes."
// ============================================================================
const PROHIBITED_TERMS = [
  "insulin",
  "medication",
  "dose",
  "dosage",
  "prescription",
  "metformin",
  "statin",
  "pill",
  "drug",
];

function containsProhibitedTerms(obj) {
  if (!obj) return false;
  const str = (typeof obj === "string" ? obj : JSON.stringify(obj)).toLowerCase();
  return PROHIBITED_TERMS.some((term) => str.includes(term));
}

// Allowlisted lifestyle simulation types
const ALLOWED_SIMULATION_TYPES = new Set([
  "steps",
  "sleep",
  "alcohol",
  "custom_lifestyle",
]);

// ============================================================================
// GET /api/simulations
// Retrieve all saved scenario simulations for authenticated user
// ============================================================================
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.userId || req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized user" });
    }

    const simulations = await prisma.scenarioSimulation.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json(simulations);
  } catch (error) {
    console.error("Error retrieving simulations:", error);
    return res.status(500).json({
      error: "SERVER_ERROR",
      message: "Failed to retrieve saved simulations.",
    });
  }
});

// ============================================================================
// POST /api/simulations
// Save a lifestyle scenario simulation with strict medication prohibition
// ============================================================================
router.post("/", auth, async (req, res) => {
  try {
    const userId = req.userId || req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized user" });
    }

    const { name, description, changes, result } = req.body;

    if (!name || typeof name !== "string") {
      return res.status(400).json({
        error: "INVALID_NAME",
        message: "Simulation name is required and must be a string.",
      });
    }

    // 1. Strict Medical Safety Guard: Reject insulin & medication alterations
    if (
      containsProhibitedTerms(name) ||
      containsProhibitedTerms(description) ||
      containsProhibitedTerms(changes) ||
      containsProhibitedTerms(result)
    ) {
      return res.status(400).json({
        error: "PROHIBITED_MEDICATION_SIMULATION",
        message:
          "Do not simulate insulin or medication changes. MediTwin strictly models non-pharmacological lifestyle factors (steps, sleep, alcohol).",
      });
    }

    // 2. Validate simulation changes payload
    if (!changes || typeof changes !== "object") {
      return res.status(400).json({
        error: "INVALID_CHANGES",
        message: "Simulation changes payload is required.",
      });
    }

    const changeType = changes.type || "custom_lifestyle";
    if (!ALLOWED_SIMULATION_TYPES.has(changeType)) {
      return res.status(400).json({
        error: "INVALID_TYPE",
        message: `Simulation type must be one of: ${Array.from(ALLOWED_SIMULATION_TYPES).join(", ")}.`,
      });
    }

    // 3. Format result with standard Low Confidence rating
    const safeResult = {
      currentPattern: result?.currentPattern || "Baseline pattern",
      simulatedPattern: result?.simulatedPattern || "Simulated pattern",
      estimatedResult:
        result?.estimatedResult || "likely improvement in consistency",
      confidence: "low",
      disclaimer:
        "Educational prototype simulation—not a clinical outcome prediction.",
      ...(typeof result === "object" ? result : {}),
      confidence: "low", // Always enforce low confidence for lifestyle prototype
    };

    const simulation = await prisma.scenarioSimulation.create({
      data: {
        userId,
        name: name.trim(),
        description: description ? String(description).trim() : null,
        changes: changes,
        result: safeResult,
      },
    });

    return res.status(201).json({
      message: "Simulation saved successfully",
      simulation,
    });
  } catch (error) {
    console.error("Error creating simulation:", error);
    return res.status(500).json({
      error: "SERVER_ERROR",
      message: "Failed to save simulation.",
    });
  }
});

// ============================================================================
// DELETE /api/simulations/:id
// Delete a saved simulation by ID
// ============================================================================
router.delete("/:id", auth, async (req, res) => {
  try {
    const userId = req.userId || req.user?.userId;
    const { id } = req.params;

    const existing = await prisma.scenarioSimulation.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return res.status(404).json({
        error: "NOT_FOUND",
        message: "Simulation record not found.",
      });
    }

    await prisma.scenarioSimulation.delete({
      where: { id },
    });

    return res.status(200).json({
      message: "Simulation deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting simulation:", error);
    return res.status(500).json({
      error: "SERVER_ERROR",
      message: "Failed to delete simulation.",
    });
  }
});

module.exports = router;
