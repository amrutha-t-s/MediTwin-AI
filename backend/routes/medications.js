const express = require("express");
const prisma = require("../prismaClient");
const auth = require("../middleware/auth");
const { logAudit } = require("../utils/auditLogger");

const router = express.Router();

// ======================================================
// GET /api/medications
// Retrieve all medications for the authenticated user
// ======================================================
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.userId || req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const medications = await prisma.medication.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      medications,
      total: medications.length,
      activeCount: medications.filter((m) => m.isActive).length,
    });
  } catch (error) {
    console.error("GET MEDICATIONS ERROR:", error.message);
    res.status(500).json({ error: "Failed to retrieve medications." });
  }
});

// ======================================================
// POST /api/medications
// Add a new medication record
// ======================================================
router.post("/", auth, async (req, res) => {
  try {
    const userId = req.userId || req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { name, dosage, frequency, instructions, startDate, isActive } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ error: "Medication name is required." });
    }

    // Input length limit checks (OWASP)
    if (name.length > 100) {
      return res.status(400).json({ error: "Medication name is too long (max 100 characters)." });
    }

    const medication = await prisma.medication.create({
      data: {
        userId,
        name: name.trim(),
        dosage: dosage ? String(dosage).trim().slice(0, 50) : null,
        frequency: frequency ? String(frequency).trim().slice(0, 100) : null,
        instructions: instructions ? String(instructions).trim().slice(0, 255) : null,
        startDate: startDate ? new Date(startDate) : new Date(),
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    await logAudit({
      userId,
      action: "MEDICATION_ADDED",
      entity: "Medication",
      entityId: medication.id,
      req,
      details: { medicationId: medication.id, isActive: medication.isActive },
    });

    res.status(201).json({
      message: "Medication added successfully.",
      medication,
    });
  } catch (error) {
    console.error("POST MEDICATION ERROR:", error.message);
    res.status(500).json({ error: "Failed to create medication." });
  }
});

// ======================================================
// PUT /api/medications/:id
// Update medication record or active status
// ======================================================
router.put("/:id", auth, async (req, res) => {
  try {
    const userId = req.userId || req.user?.userId;
    const { id } = req.params;

    const existing = await prisma.medication.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return res.status(404).json({ error: "Medication record not found." });
    }

    const { name, dosage, frequency, instructions, startDate, isActive } = req.body;

    const updated = await prisma.medication.update({
      where: { id },
      data: {
        name: name !== undefined ? String(name).trim().slice(0, 100) : existing.name,
        dosage: dosage !== undefined ? String(dosage).trim().slice(0, 50) : existing.dosage,
        frequency: frequency !== undefined ? String(frequency).trim().slice(0, 100) : existing.frequency,
        instructions: instructions !== undefined ? String(instructions).trim().slice(0, 255) : existing.instructions,
        startDate: startDate ? new Date(startDate) : existing.startDate,
        isActive: isActive !== undefined ? Boolean(isActive) : existing.isActive,
      },
    });

    res.json({
      message: "Medication updated successfully.",
      medication: updated,
    });
  } catch (error) {
    console.error("UPDATE MEDICATION ERROR:", error.message);
    res.status(500).json({ error: "Failed to update medication." });
  }
});

// ======================================================
// DELETE /api/medications/:id
// Remove a medication record
// ======================================================
router.delete("/:id", auth, async (req, res) => {
  try {
    const userId = req.userId || req.user?.userId;
    const { id } = req.params;

    const existing = await prisma.medication.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return res.status(404).json({ error: "Medication record not found." });
    }

    await prisma.medication.delete({ where: { id } });

    res.json({ message: "Medication deleted successfully." });
  } catch (error) {
    console.error("DELETE MEDICATION ERROR:", error.message);
    res.status(500).json({ error: "Failed to delete medication." });
  }
});

module.exports = router;
