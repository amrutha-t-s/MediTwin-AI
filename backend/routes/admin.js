const express = require("express");
const prisma = require("../prismaClient");
const auth = require("../middleware/auth");
const { requireRole } = require("../middleware/rbac");
const { logAudit } = require("../utils/auditLogger");

const router = express.Router();

// Enforce authentication AND admin role on all admin routes
router.use(auth);
router.use(requireRole("admin"));

// ======================================================
// GET /api/admin/stats
// System health and account metrics
// ======================================================
router.get("/stats", async (req, res) => {
  try {
    const [totalUsers, totalDailyLogs, totalSimulations, totalAuditLogs] =
      await Promise.all([
        prisma.user.count(),
        prisma.dailyHealthLog.count(),
        prisma.scenarioSimulation.count(),
        prisma.auditLog.count(),
      ]);

    // Count users grouped by role
    const usersByRole = await prisma.user.groupBy({
      by: ["role"],
      _count: { id: true },
    });

    res.json({
      totalUsers,
      totalDailyLogs,
      totalSimulations,
      totalAuditLogs,
      usersByRole: usersByRole.reduce((acc, curr) => {
        acc[curr.role] = curr._count.id;
        return acc;
      }, {}),
    });
  } catch (err) {
    console.error("ADMIN STATS ERROR:", err.message);
    res.status(500).json({ error: "Failed to retrieve administrative statistics." });
  }
});

// ======================================================
// GET /api/admin/audit-logs
// System-wide security and compliance audit log inspection
// ======================================================
router.get("/audit-logs", async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 100);
    const actionFilter = req.query.action ? String(req.query.action) : undefined;

    const where = actionFilter ? { action: actionFilter } : {};

    const logs = await prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        userId: true,
        action: true,
        entity: true,
        entityId: true,
        ipAddress: true,
        userAgent: true,
        details: true,
        createdAt: true,
      },
    });

    res.json({
      count: logs.length,
      auditLogs: logs,
    });
  } catch (err) {
    console.error("ADMIN AUDIT LOGS ERROR:", err.message);
    res.status(500).json({ error: "Failed to retrieve system audit logs." });
  }
});

// ======================================================
// GET /api/admin/users
// Manage registered users
// ======================================================
router.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({ users });
  } catch (err) {
    console.error("ADMIN USERS ERROR:", err.message);
    res.status(500).json({ error: "Failed to retrieve users." });
  }
});

// ======================================================
// PATCH /api/admin/users/:id/role
// Update user's role (patient, doctor, admin)
// ======================================================
router.patch("/users/:id/role", async (req, res) => {
  try {
    const { role } = req.body;
    const allowedRoles = ["patient", "doctor", "admin"];

    if (!role || !allowedRoles.includes(role.toLowerCase())) {
      return res.status(400).json({
        error: `Invalid role. Allowed values: ${allowedRoles.join(", ")}`,
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.params.id },
      data: { role: role.toLowerCase() },
      select: { id: true, email: true, fullName: true, role: true },
    });

    await logAudit({
      userId: req.userId,
      action: "USER_ROLE_UPDATED",
      entity: "User",
      entityId: updatedUser.id,
      req,
      details: {
        targetUserId: updatedUser.id,
        newRole: updatedUser.role,
      },
    });

    res.json({
      message: "User role updated successfully.",
      user: updatedUser,
    });
  } catch (err) {
    console.error("ADMIN UPDATE ROLE ERROR:", err.message);
    res.status(500).json({ error: "Failed to update user role." });
  }
});

module.exports = router;
