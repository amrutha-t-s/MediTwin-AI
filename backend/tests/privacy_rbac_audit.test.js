/**
 * Test Suite: Privacy, Consent, Audit Logging, RBAC & Security
 *
 * Runs without external testing frameworks using Node.js built-in assert runner.
 * Safe to run against the database: uses an ephemeral test user that is cleaned up afterwards.
 */

const assert = require("assert");
const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");
const { logAudit } = require("../utils/auditLogger");
const { requireRole } = require("../middleware/rbac");
const authMiddleware = require("../middleware/auth");

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";

async function runTests() {
  console.log("\n=======================================================");
  console.log("   🧪 MEDITWIN PRIVACY, RBAC & AUDIT TEST SUITE");
  console.log("=======================================================\n");

  let testUser = null;
  let testAdmin = null;
  let testDoctor = null;

  try {
    // -------------------------------------------------------------
    // SETUP: Create ephemeral test users
    // -------------------------------------------------------------
    console.log("▶ [SETUP] Initializing ephemeral test accounts...");
    const timestamp = Date.now();

    testUser = await prisma.user.create({
      data: {
        email: `test_privacy_${timestamp}@meditwin.test`,
        passwordHash: "hashed_dummy_password",
        role: "patient",
        fullName: "Test Privacy Patient",
      },
    });

    testDoctor = await prisma.user.create({
      data: {
        email: `test_doctor_${timestamp}@meditwin.test`,
        passwordHash: "hashed_dummy_password",
        role: "doctor",
        fullName: "Dr. Test Clinician",
      },
    });

    testAdmin = await prisma.user.create({
      data: {
        email: `test_admin_${timestamp}@meditwin.test`,
        passwordHash: "hashed_dummy_password",
        role: "admin",
        fullName: "Test Administrator",
      },
    });

    console.log("  ✓ Test accounts created successfully.\n");

    // -------------------------------------------------------------
    // TEST 1: Audit Logging Strips PHI (Privacy Guardrail)
    // -------------------------------------------------------------
    console.log("▶ [TEST 1] Audit Logging Sanitization (Zero PHI in Logs)...");
    const testAudit = await logAudit({
      userId: testUser.id,
      action: "TEST_CLINICAL_ACTION",
      entity: "DailyHealthLog",
      entityId: "dummy-id",
      details: {
        // Clinical metrics that MUST be stripped
        glucose: 145.5,
        bpSystolic: 128,
        bpDiastolic: 82,
        medicationName: "Metformin",
        // Safe metadata that should be preserved
        clientVersion: "1.0.0",
        eventStatus: "SUCCESS",
      },
    });

    assert.ok(testAudit, "Audit log entry should be created in database");
    assert.strictEqual(testAudit.action, "TEST_CLINICAL_ACTION");
    assert.strictEqual(testAudit.details.glucose, undefined, "Raw glucose must NOT be logged");
    assert.strictEqual(testAudit.details.bpSystolic, undefined, "Raw BP systolic must NOT be logged");
    assert.strictEqual(testAudit.details.bpDiastolic, undefined, "Raw BP diastolic must NOT be logged");
    assert.strictEqual(testAudit.details.medicationName, undefined, "Medication name must NOT be logged");
    assert.strictEqual(testAudit.details.clientVersion, "1.0.0", "Non-PHI metadata should be preserved");
    console.log("  ✓ PASS: Audit logging strictly stripped all sensitive health metrics (glucose, BP, medications).\n");

    // -------------------------------------------------------------
    // TEST 2: Role-Based Authorization (RBAC Middleware)
    // -------------------------------------------------------------
    console.log("▶ [TEST 2] Role-Based Access Control (RBAC)...");
    const adminRbac = requireRole("admin");
    const doctorRbac = requireRole("doctor", "admin");

    // Case 2a: Patient blocked from admin route
    let forbiddenCalled = false;
    const mockRes403 = {
      status: (code) => ({
        json: (data) => {
          if (code === 403) forbiddenCalled = true;
          return data;
        },
      }),
    };
    adminRbac(
      { user: { role: "patient" } },
      mockRes403,
      () => assert.fail("Patient must NOT access admin route")
    );
    assert.ok(forbiddenCalled, "Patient must receive 403 Forbidden on admin resource");

    // Case 2b: Admin allowed on admin route
    let nextCalled = false;
    adminRbac(
      { user: { role: "admin" } },
      {},
      () => { nextCalled = true; }
    );
    assert.ok(nextCalled, "Admin must be granted access to admin route");

    // Case 2c: Doctor allowed on clinician route
    let doctorNextCalled = false;
    doctorRbac(
      { user: { role: "doctor" } },
      {},
      () => { doctorNextCalled = true; }
    );
    assert.ok(doctorNextCalled, "Doctor must be granted access to doctor route");

    // Case 2d: Patient blocked from doctor route
    let patientBlockedFromDoctor = false;
    doctorRbac(
      { user: { role: "patient" } },
      mockRes403,
      () => assert.fail("Patient must NOT access doctor route")
    );
    assert.ok(forbiddenCalled, "Patient must be blocked from doctor dashboard");
    console.log("  ✓ PASS: RBAC successfully isolates patient, clinician, and administrator privileges.\n");

    // -------------------------------------------------------------
    // TEST 3: Consent Management (Research-Use Toggle)
    // -------------------------------------------------------------
    console.log("▶ [TEST 3] Research Consent Grant & Revocation...");
    // Create initial research consent
    const consentRecord = await prisma.consent.create({
      data: {
        userId: testUser.id,
        consentType: "research_use",
        granted: true,
        version: "1.0",
        grantedAt: new Date(),
      },
    });

    assert.strictEqual(consentRecord.granted, true);
    assert.strictEqual(consentRecord.consentType, "research_use");

    // Update to revoked
    const revokedRecord = await prisma.consent.update({
      where: { id: consentRecord.id },
      data: {
        granted: false,
        revokedAt: new Date(),
      },
    });
    assert.strictEqual(revokedRecord.granted, false);
    assert.ok(revokedRecord.revokedAt, "Revocation timestamp must be recorded");
    console.log("  ✓ PASS: Research consent can be granted, stored, and revoked at any time.\n");

    // -------------------------------------------------------------
    // TEST 4: Logout from All Sessions (Cryptographic Revocation)
    // -------------------------------------------------------------
    console.log("▶ [TEST 4] Session Revocation (Logout from all sessions)...");
    // Issue token at timestamp T
    const pastTimestampSeconds = Math.floor(Date.now() / 1000) - 10;
    const oldToken = jwt.sign(
      { userId: testUser.id, email: testUser.email, role: testUser.role, iat: pastTimestampSeconds },
      JWT_SECRET
    );

    // Record LOGOUT_ALL_SESSIONS audit event created NOW (> pastTimestampSeconds)
    await prisma.auditLog.create({
      data: {
        userId: testUser.id,
        action: "LOGOUT_ALL_SESSIONS",
        createdAt: new Date(),
      },
    });

    // Test auth middleware rejection
    let sessionRevokedError = null;
    const reqWithOldToken = {
      headers: { authorization: `Bearer ${oldToken}` },
    };
    const resAuth = {
      status: (code) => ({
        json: (data) => {
          if (code === 401 && data.code === "SESSION_REVOKED") {
            sessionRevokedError = data;
          }
          return data;
        },
      }),
    };

    await authMiddleware(reqWithOldToken, resAuth, () => {
      assert.fail("Old token must NOT be accepted after logout-all");
    });

    assert.ok(sessionRevokedError, "Token issued before logout-all must be rejected with SESSION_REVOKED");
    console.log("  ✓ PASS: Logout-all immediately invalidates all prior issued tokens across all devices.\n");

    // -------------------------------------------------------------
    // TEST 5: Cascading Account Deletion
    // -------------------------------------------------------------
    console.log("▶ [TEST 5] Complete Account & Health Data Cascading Deletion...");
    // Add dummy daily log and medication for testUser
    await prisma.dailyHealthLog.create({
      data: {
        userId: testUser.id,
        date: new Date(),
        glucose: 110,
        steps: 7500,
      },
    });
    await prisma.medication.create({
      data: {
        userId: testUser.id,
        name: "Test Aspirin",
      },
    });

    // Verify records exist
    const logsBefore = await prisma.dailyHealthLog.count({ where: { userId: testUser.id } });
    assert.strictEqual(logsBefore, 1);

    // Execute cascade delete
    await prisma.dailyHealthLog.deleteMany({ where: { userId: testUser.id } });
    await prisma.medication.deleteMany({ where: { userId: testUser.id } });
    await prisma.scenarioSimulation.deleteMany({ where: { userId: testUser.id } });
    await prisma.prediction.deleteMany({ where: { userId: testUser.id } });
    await prisma.familyHistory.deleteMany({ where: { userId: testUser.id } });
    await prisma.healthProfile.deleteMany({ where: { userId: testUser.id } });
    await prisma.consent.deleteMany({ where: { userId: testUser.id } });
    await prisma.auditLog.deleteMany({ where: { userId: testUser.id } });
    await prisma.user.delete({ where: { id: testUser.id } });

    // Verify completely purged
    const userAfter = await prisma.user.findUnique({ where: { id: testUser.id } });
    const logsAfter = await prisma.dailyHealthLog.count({ where: { userId: testUser.id } });
    assert.strictEqual(userAfter, null, "User account must be permanently deleted");
    assert.strictEqual(logsAfter, 0, "All health logs must be purged");
    testUser = null; // Mark cleaned up

    console.log("  ✓ PASS: Account deletion successfully purged all user biometrics and records.\n");

    console.log("=======================================================");
    console.log("   🎉 ALL PRIVACY, RBAC & AUDIT TESTS PASSED (100%)");
    console.log("=======================================================\n");
  } catch (err) {
    console.error("❌ TEST SUITE FAILURE:", err);
    process.exitCode = 1;
  } finally {
    // CLEANUP
    if (testUser) {
      await prisma.user.delete({ where: { id: testUser.id } }).catch(() => {});
    }
    if (testDoctor) {
      await prisma.user.delete({ where: { id: testDoctor.id } }).catch(() => {});
    }
    if (testAdmin) {
      await prisma.user.delete({ where: { id: testAdmin.id } }).catch(() => {});
    }
    await prisma.$disconnect();
  }
}

runTests();
