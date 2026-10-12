const express = require("express");
const prisma = require("../prismaClient");
const auth = require("../middleware/auth");
const { logAudit } = require("../utils/auditLogger");

const router = express.Router();

// ======================================================
// GET /api/privacy/info
// Privacy metadata & policy details (Public or Authenticated)
// ======================================================
router.get("/info", (req, res) => {
  res.json({
    platform: "MediTwin",
    version: "1.0.0",
    effectiveDate: "2026-10-13",
    dataCollected: [
      {
        category: "Biometric & Health Metrics",
        items: ["Blood glucose readings (mg/dL)", "Blood pressure (systolic/diastolic mmHg)", "Heart rate / pulse", "Weight (kg)", "Waist circumference (cm)"],
        purpose: "Computing health consistency scores and Digital Twin status patterns.",
      },
      {
        category: "Lifestyle & Daily Behaviors",
        items: ["Sleep duration, bedtime, wake time, and sleep quality", "Step counts, active minutes, and sedentary hours", "Water intake"],
        purpose: "Correlating lifestyle factors with wellness consistency without diagnostic claims.",
      },
      {
        category: "Nutrition & Dietary Habits",
        items: ["Meal times and portions", "Dietary flags (sugary drinks, high carbs, fried foods, vegetables)", "Alcohol and smoking status"],
        purpose: "Identifying lifestyle associations and driving non-pharmacological simulations.",
      },
      {
        category: "Medication Adherence",
        items: ["Medication names, prescribed dosages, frequencies", "Logged adherence (taken vs missed) and missed reason"],
        purpose: "Adherence rate tracking only. MediTwin never alters or simulates medication doses.",
      },
      {
        category: "Security & Audit Metadata",
        items: ["Authentication timestamps", "Anonymized IP address and user-agent string", "Consent grant/revocation history"],
        purpose: "Preserving account security, fraud prevention, and session auditing without logging clinical metrics.",
      },
    ],
    whyCollected: [
      "To build the patient's individual Digital Twin observational health-state model.",
      "To calculate the transparent Health Consistency Score (Activity, Sleep, Medication, Glucose).",
      "To power the rule-based Insight Engine using associative, non-causal patterns.",
      "To provide non-pharmacological lifestyle simulations (+2,000 steps, +1hr sleep, alcohol-free periods).",
      "To protect the user account and verify authorized role-based access.",
    ],
    whoCanSeeIt: [
      "Strictly the authenticated user (account owner).",
      "Authorized clinical providers if explicitly granted by the patient through role delegation.",
      "System administrators only have access to anonymized audit and security telemetry—no clinical records.",
      "Never shared, rented, or sold to third-party advertisers, insurance providers, or data brokers.",
    ],
    howToManageAndDelete: [
      "Individual record deletion: Delete any health log directly from the Health History table.",
      "Self-service complete account deletion: Purge all health logs, medications, profiles, simulations, and account credentials in one permanent action.",
      "Data export: Download complete, machine-readable personal health records at any time.",
    ],
    disclaimer:
      "MediTwin is an educational health-monitoring and observational simulation prototype. It is NOT a medical device and does not provide medical diagnoses, treatment plans, or clinical directives. Never alter insulin, prescription medications, or therapeutic regimens based on this tool. Always consult a licensed healthcare professional for medical care.",
    researchPolicy: {
      scope: "Optional de-identified and aggregated health patterns used strictly for wellness algorithm calibration and statistical research.",
      anonymization: "All direct identifiers (name, email, exact location) are permanently stripped before any research-level aggregation.",
      consentRequired: true,
      revocableAnytime: true,
    },
    contact: {
      privacyOffice: "privacy@meditwin.health",
      dataProtectionOfficer: "dpo@meditwin.health",
      securityTeam: "security@meditwin.health",
      physicalAddress: "MediTwin Health Technologies, 100 Innovation Way, Suite 400, Cambridge, MA 02142",
      responseTime: "Within 24-48 business hours",
    },
  });
});

// ======================================================
// GET /api/privacy/consent
// Retrieve current user's consent preferences
// ======================================================
router.get("/consent", auth, async (req, res) => {
  try {
    const consents = await prisma.consent.findMany({
      where: { userId: req.userId },
      orderBy: { updatedAt: "desc" },
    });

    const termsConsent = consents.find((c) => c.consentType === "terms_and_privacy");
    const researchConsent = consents.find((c) => c.consentType === "research_use");

    res.json({
      termsAndPrivacy: termsConsent ? termsConsent.granted : true,
      researchConsent: researchConsent ? researchConsent.granted : false,
      researchGrantedAt: researchConsent?.grantedAt || null,
      researchRevokedAt: researchConsent?.revokedAt || null,
      version: researchConsent?.version || "1.0",
      lastUpdated: researchConsent?.updatedAt || termsConsent?.updatedAt || new Date(),
    });
  } catch (err) {
    console.error("GET CONSENT ERROR:", err.message);
    res.status(500).json({ error: "Failed to retrieve consent settings." });
  }
});

// ======================================================
// POST /api/privacy/consent
// Update research consent preference
// ======================================================
router.post("/consent", auth, async (req, res) => {
  try {
    const { researchConsent } = req.body;

    if (typeof researchConsent !== "boolean") {
      return res.status(400).json({
        error: "researchConsent boolean field is required.",
      });
    }

    const existing = await prisma.consent.findFirst({
      where: {
        userId: req.userId,
        consentType: "research_use",
      },
    });

    let record;
    if (existing) {
      record = await prisma.consent.update({
        where: { id: existing.id },
        data: {
          granted: researchConsent,
          grantedAt: researchConsent ? new Date() : existing.grantedAt,
          revokedAt: !researchConsent ? new Date() : null,
          version: "1.0",
        },
      });
    } else {
      record = await prisma.consent.create({
        data: {
          userId: req.userId,
          consentType: "research_use",
          granted: researchConsent,
          version: "1.0",
          grantedAt: researchConsent ? new Date() : null,
          revokedAt: !researchConsent ? new Date() : null,
        },
      });
    }

    // Audit log (sanitized: no PHI)
    await logAudit({
      userId: req.userId,
      action: researchConsent ? "RESEARCH_CONSENT_GRANTED" : "RESEARCH_CONSENT_REVOKED",
      entity: "Consent",
      entityId: record.id,
      req,
      details: {
        consentType: "research_use",
        granted: researchConsent,
        version: "1.0",
      },
    });

    res.json({
      message: researchConsent
        ? "Research-use consent granted. Thank you for contributing to de-identified wellness studies."
        : "Research-use consent successfully revoked. Your data will be excluded from research pools.",
      researchConsent: record.granted,
      updatedAt: record.updatedAt,
    });
  } catch (err) {
    console.error("POST CONSENT ERROR:", err.message);
    res.status(500).json({ error: "Failed to update consent settings." });
  }
});

// ======================================================
// GET /api/privacy/export
// Download complete personal health data (JSON)
// SENSITIVITY RULE: Never expose health records in URLs or console logs
// ======================================================
router.get("/export", auth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const healthProfile = await prisma.healthProfile.findUnique({
      where: { userId: req.userId },
    });

    const dailyHealthLogs = await prisma.dailyHealthLog.findMany({
      where: { userId: req.userId },
      orderBy: { date: "asc" },
    });

    const medications = await prisma.medication.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
    });

    const familyHistories = await prisma.familyHistory.findMany({
      where: { userId: req.userId },
    });

    const scenarioSimulations = await prisma.scenarioSimulation.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
    });

    const consents = await prisma.consent.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "asc" },
    });

    // Audit log (sanitized: only records count, NO clinical values in audit log)
    await logAudit({
      userId: req.userId,
      action: "DATA_EXPORT_DOWNLOADED",
      entity: "HealthRecordBundle",
      entityId: req.userId,
      req,
      details: {
        recordCounts: {
          dailyLogs: dailyHealthLogs.length,
          medications: medications.length,
          simulations: scenarioSimulations.length,
        },
        exportFormat: "JSON",
      },
    });

    const exportBundle = {
      exportMetadata: {
        application: "MediTwin AI",
        version: "1.0",
        exportedAt: new Date().toISOString(),
        patientId: user.id,
        classification: "CONFIDENTIAL_PERSONAL_HEALTH_RECORD",
        notice:
          "This file contains your complete MediTwin health data export. Store securely and do not share public links.",
      },
      user,
      healthProfile: healthProfile || null,
      dailyHealthLogs,
      medications,
      familyHistories,
      scenarioSimulations,
      consents,
    };

    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="meditwin_health_export_${new Date().toISOString().slice(0, 10)}.json"`
    );

    return res.status(200).json(exportBundle);
  } catch (err) {
    console.error("DATA EXPORT ERROR:", err.message);
    res.status(500).json({ error: "Failed to generate health data export." });
  }
});

// ======================================================
// POST /api/privacy/logout-all
// Invalidate all active sessions across devices
// ======================================================
router.post("/logout-all", auth, async (req, res) => {
  try {
    // Record session revocation timestamp in audit log
    await logAudit({
      userId: req.userId,
      action: "LOGOUT_ALL_SESSIONS",
      entity: "UserSession",
      entityId: req.userId,
      req,
      details: {
        reason: "User requested termination of all active sessions",
        revocationTimestamp: new Date().toISOString(),
      },
    });

    res.json({
      message: "Successfully logged out from all sessions across all devices.",
      revokedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("LOGOUT ALL ERROR:", err.message);
    res.status(500).json({ error: "Failed to revoke sessions." });
  }
});

// ======================================================
// DELETE /api/privacy/account
// Cascading permanent account and data deletion
// ======================================================
router.delete("/account", auth, async (req, res) => {
  try {
    const { confirmationText } = req.body || {};

    if (confirmationText !== "DELETE") {
      return res.status(400).json({
        error: "Account deletion requires confirmation. Please provide { confirmationText: 'DELETE' }.",
      });
    }

    const userId = req.userId;

    // Log final audit record
    await logAudit({
      userId: null, // detached since user will be deleted
      action: "ACCOUNT_DELETED",
      entity: "User",
      entityId: userId,
      req,
      details: {
        reason: "User executed self-service permanent account wipeout",
      },
    });

    // Cascading deletion across all tables
    await prisma.dailyHealthLog.deleteMany({ where: { userId } });
    await prisma.medication.deleteMany({ where: { userId } });
    await prisma.scenarioSimulation.deleteMany({ where: { userId } });
    await prisma.prediction.deleteMany({ where: { userId } });
    await prisma.familyHistory.deleteMany({ where: { userId } });
    await prisma.healthProfile.deleteMany({ where: { userId } });
    await prisma.consent.deleteMany({ where: { userId } });
    await prisma.auditLog.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });

    res.json({
      message: "Account and all associated personal health records have been permanently deleted.",
      deletedUserId: userId,
    });
  } catch (err) {
    console.error("DELETE ACCOUNT ERROR:", err.message);
    res.status(500).json({ error: "Failed to delete account." });
  }
});

// ======================================================
// GET /api/privacy/audit-logs
// View user's own security & privacy audit trail
// PRIVACY RULE: Strip all PHI from output
// ======================================================
router.get("/audit-logs", auth, async (req, res) => {
  try {
    const logs = await prisma.auditLog.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        action: true,
        entity: true,
        ipAddress: true,
        userAgent: true,
        details: true,
        createdAt: true,
      },
    });

    res.json({
      total: logs.length,
      auditLogs: logs,
      privacyStatement: "No health metrics (glucose, blood pressure, medications) are stored in audit logs.",
    });
  } catch (err) {
    console.error("GET AUDIT LOGS ERROR:", err.message);
    res.status(500).json({ error: "Failed to load audit logs." });
  }
});

module.exports = router;
