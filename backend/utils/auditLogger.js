const prisma = require("../prismaClient");

/**
 * Securely logs an audit event to the database.
 *
 * CRITICAL PRIVACY RULE:
 * Health records (glucose, BP, heart rate, medications, food details, diagnoses)
 * are strictly forbidden from being stored in audit logs or console logs.
 *
 * @param {Object} options
 * @param {string} options.userId - ID of the user performing the action
 * @param {string} options.action - Audit action code (e.g., LOGIN, LOGOUT_ALL_SESSIONS, EXPORT_DATA, CONSENT_UPDATE, DELETE_ACCOUNT)
 * @param {string} [options.entity] - Entity affected (e.g., User, Consent, DailyHealthLog, Session)
 * @param {string} [options.entityId] - Target entity ID
 * @param {Object} [options.req] - Express request for extracting IP and User-Agent
 * @param {Object} [options.details] - Non-PHI metadata ONLY.
 */
async function logAudit({ userId, action, entity, entityId, req, details = {} }) {
  try {
    const ipAddress = req
      ? req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
        req.socket?.remoteAddress ||
        req.ip ||
        "127.0.0.1"
      : "system";

    const userAgent = req ? req.headers["user-agent"] || "unknown" : "internal";

    // Strictly strip any PHI or health metrics if accidentally passed
    const sanitizedDetails = { ...details };
    const forbiddenKeys = [
      "glucose",
      "bpSystolic",
      "bpDiastolic",
      "systolicBP",
      "diastolicBP",
      "heartRate",
      "pulseRate",
      "medication",
      "medications",
      "medicationName",
      "dosage",
      "diagnosis",
      "conditions",
      "allergies",
      "foodDetails",
      "foodSummary",
      "symptoms",
    ];

    for (const key of forbiddenKeys) {
      if (key in sanitizedDetails) {
        delete sanitizedDetails[key];
      }
    }

    const entry = await prisma.auditLog.create({
      data: {
        userId: userId || null,
        action: String(action || "UNKNOWN_ACTION"),
        entity: entity ? String(entity) : null,
        entityId: entityId ? String(entityId) : null,
        ipAddress: ipAddress ? String(ipAddress).slice(0, 45) : null,
        userAgent: userAgent ? String(userAgent).slice(0, 255) : null,
        details: sanitizedDetails,
      },
    });

    return entry;
  } catch (err) {
    // Audit logging should fail gracefully without disrupting user workflows
    console.warn("Audit logging warning:", err.message);
    return null;
  }
}

module.exports = { logAudit };
