const express = require("express");
const prisma = require("../prismaClient");
const auth = require("../middleware/auth");

const router = express.Router();

/**
 * GET /api/dashboard/summary
 * Provides a comprehensive summary for the dashboard:
 * - Latest glucose reading
 * - Latest BP reading
 * - Today's steps
 * - Sleep duration
 * - Weight
 * - Medication status
 * - Weekly health score
 */
router.get("/summary", auth, async (req, res) => {
  try {
    const userId = req.userId || req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized user" });
    }

    // Fetch user's recent daily logs (last 14 records)
    const logs = await prisma.dailyHealthLog.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 14,
    });

    // Fetch active medications
    const medications = await prisma.medication.findMany({
      where: { userId, isActive: true },
    });

    // Fetch health profile
    const healthProfile = await prisma.healthProfile.findUnique({
      where: { userId },
    });

    const todayStr = new Date().toISOString().split("T")[0];

    // Find log specifically for today
    const todayLog = logs.find(
      (l) =>
        l.date &&
        new Date(l.date).toISOString().split("T")[0] === todayStr
    );

    // ==================================================
    // 1. LATEST GLUCOSE READING
    // ==================================================
    const glucoseLog = logs.find((l) => l.glucose != null);
    let latestGlucose = null;

    if (glucoseLog && glucoseLog.glucose != null) {
      const val = Number(glucoseLog.glucose);
      let status = "Normal";
      let statusColor = "green";

      if (val < 70) {
        status = "Low";
        statusColor = "blue";
      } else if (val <= 130) {
        status = "Normal";
        statusColor = "green";
      } else if (val <= 180) {
        status = "Elevated";
        statusColor = "amber";
      } else {
        status = "High";
        statusColor = "red";
      }

      latestGlucose = {
        value: val,
        unit: "mg/dL",
        date: glucoseLog.date,
        status,
        statusColor,
      };
    } else if (healthProfile?.fastingGlucose != null) {
      const val = Number(healthProfile.fastingGlucose);
      latestGlucose = {
        value: val,
        unit: "mg/dL",
        date: healthProfile.updatedAt || null,
        status: val <= 100 ? "Normal" : val <= 125 ? "Pre-diabetic" : "High",
        statusColor: val <= 100 ? "green" : val <= 125 ? "amber" : "red",
        isProfileBaseline: true,
      };
    }

    // ==================================================
    // 2. LATEST BLOOD PRESSURE READING
    // ==================================================
    const bpLog = logs.find(
      (l) => l.bpSystolic != null || l.bpDiastolic != null
    );
    let latestBP = null;

    if (bpLog) {
      const sys = bpLog.bpSystolic != null ? Number(bpLog.bpSystolic) : null;
      const dia = bpLog.bpDiastolic != null ? Number(bpLog.bpDiastolic) : null;
      let status = "Normal";
      let statusColor = "green";

      if (sys != null && dia != null) {
        if (sys < 90 || dia < 60) {
          status = "Low";
          statusColor = "blue";
        } else if (sys < 120 && dia < 80) {
          status = "Normal";
          statusColor = "green";
        } else if (sys <= 129 && dia < 80) {
          status = "Elevated";
          statusColor = "amber";
        } else if (sys <= 139 || dia <= 89) {
          status = "Stage 1";
          statusColor = "amber";
        } else {
          status = "Stage 2";
          statusColor = "red";
        }
      }

      latestBP = {
        systolic: sys,
        diastolic: dia,
        heartRate: bpLog.heartRate != null ? Number(bpLog.heartRate) : null,
        unit: "mmHg",
        date: bpLog.date,
        status,
        statusColor,
      };
    }

    // ==================================================
    // 3. TODAY'S STEPS
    // ==================================================
    const stepsLog =
      todayLog && todayLog.steps != null
        ? todayLog
        : logs.find((l) => l.steps != null);

    const isTodaySteps = !!(todayLog && todayLog.steps != null);
    const stepCount = stepsLog && stepsLog.steps != null ? Number(stepsLog.steps) : 0;
    const stepGoal = 10000;
    const stepPercentage = Math.min(100, Math.round((stepCount / stepGoal) * 100));

    const todaySteps = {
      steps: stepCount,
      goal: stepGoal,
      percentage: stepPercentage,
      isToday: isTodaySteps,
      date: stepsLog ? stepsLog.date : todayStr,
      exerciseMinutes: stepsLog?.exerciseMinutes ?? null,
      exerciseType: stepsLog?.exerciseType ?? null,
    };

    // ==================================================
    // 4. SLEEP DURATION
    // ==================================================
    const sleepLog = logs.find(
      (l) => l.sleepHours != null || l.sleepDuration != null
    );
    let sleepDuration = null;

    if (sleepLog) {
      const hours = Number(sleepLog.sleepHours ?? sleepLog.sleepDuration);
      let status = "Optimal";
      let statusColor = "green";

      if (hours < 6) {
        status = "Short";
        statusColor = "amber";
      } else if (hours >= 7 && hours <= 9) {
        status = "Optimal";
        statusColor = "green";
      } else if (hours > 9) {
        status = "Long";
        statusColor = "blue";
      } else {
        status = "Fair";
        statusColor = "amber";
      }

      sleepDuration = {
        hours,
        quality: sleepLog.sleepQuality ?? null,
        nightAwakenings: sleepLog.nightAwakenings ?? null,
        date: sleepLog.date,
        status,
        statusColor,
      };
    } else if (healthProfile?.typicalSleep != null) {
      const hours = Number(healthProfile.typicalSleep);
      sleepDuration = {
        hours,
        quality: null,
        date: healthProfile.updatedAt || null,
        status: hours >= 7 && hours <= 9 ? "Optimal" : "Fair",
        statusColor: hours >= 7 && hours <= 9 ? "green" : "amber",
        isProfileBaseline: true,
      };
    }

    // ==================================================
    // 5. WEIGHT & BMI
    // ==================================================
    const weightLog = logs.find((l) => l.weightKg != null);
    const weightLogsList = logs.filter((l) => l.weightKg != null);
    const prevWeightLog = weightLogsList.length > 1 ? weightLogsList[1] : null;

    const currentWeight = weightLog
      ? Number(weightLog.weightKg)
      : healthProfile?.weightKg != null
      ? Number(healthProfile.weightKg)
      : null;

    let weightDiff = 0;
    if (weightLog && prevWeightLog) {
      weightDiff =
        Math.round((Number(weightLog.weightKg) - Number(prevWeightLog.weightKg)) * 10) /
        10;
    }

    let bmi = null;
    let bmiCategory = null;
    let bmiColor = "green";

    if (currentWeight && healthProfile?.heightCm) {
      const heightM = Number(healthProfile.heightCm) / 100;
      if (heightM > 0) {
        bmi = Math.round((currentWeight / (heightM * heightM)) * 10) / 10;
        if (bmi < 18.5) {
          bmiCategory = "Underweight";
          bmiColor = "blue";
        } else if (bmi <= 24.9) {
          bmiCategory = "Normal";
          bmiColor = "green";
        } else if (bmi <= 29.9) {
          bmiCategory = "Overweight";
          bmiColor = "amber";
        } else {
          bmiCategory = "Obese";
          bmiColor = "red";
        }
      }
    }

    const weight = {
      current: currentWeight,
      unit: "kg",
      diff: weightDiff,
      date: weightLog ? weightLog.date : healthProfile?.updatedAt || null,
      waistCircumference:
        weightLog?.waistCircumference ?? healthProfile?.waistCircumference ?? null,
      bmi,
      bmiCategory,
      bmiColor,
      isProfileBaseline: !weightLog && !!healthProfile?.weightKg,
    };

    // ==================================================
    // 6. MEDICATION STATUS
    // ==================================================
    const latestMedLog = logs.find(
      (l) => l.medicationTaken || l.medicationName
    );

    let medStatusText = "Pending for today";
    let medStatusColor = "amber";

    if (todayLog?.medicationTaken) {
      const taken = todayLog.medicationTaken.toLowerCase();
      if (taken.includes("yes") || taken.includes("taken") || taken.includes("all")) {
        medStatusText = "Taken today";
        medStatusColor = "green";
      } else if (taken.includes("no") || taken.includes("missed")) {
        medStatusText = todayLog.missedReason
          ? `Missed: ${todayLog.missedReason}`
          : "Missed today";
        medStatusColor = "red";
      } else {
        medStatusText = todayLog.medicationTaken;
        medStatusColor = "blue";
      }
    } else if (medications.length === 0) {
      medStatusText = "No active prescriptions";
      medStatusColor = "gray";
    }

    const medicationStatus = {
      status: medStatusText,
      statusColor: medStatusColor,
      activeCount: medications.length,
      activeList: medications.map((m) => ({
        name: m.name,
        dosage: m.dosage,
        frequency: m.frequency,
      })),
      todayTaken: todayLog?.medicationTaken || null,
      missedReason: todayLog?.missedReason || null,
      lastLoggedDate: latestMedLog ? latestMedLog.date : null,
    };

    // ==================================================
    // 7. WEEKLY HEALTH SCORE
    // ==================================================
    const recentLogs = logs.slice(0, 7);
    let glucoseScore = 20;
    let bpScore = 20;
    let activityScore = 15;
    let sleepScore = 15;
    let adherenceScore = 10;

    if (recentLogs.length > 0) {
      // 1. Glucose points (max 25)
      const gVals = recentLogs.filter((l) => l.glucose != null).map((l) => Number(l.glucose));
      if (gVals.length > 0) {
        const avgG = gVals.reduce((a, b) => a + b, 0) / gVals.length;
        if (avgG >= 70 && avgG <= 140) glucoseScore = 25;
        else if (avgG <= 180) glucoseScore = 18;
        else glucoseScore = 10;
      }

      // 2. BP points (max 25)
      const bpVals = recentLogs.filter((l) => l.bpSystolic != null);
      if (bpVals.length > 0) {
        const sysAvg =
          bpVals.reduce((a, b) => a + Number(b.bpSystolic), 0) / bpVals.length;
        if (sysAvg < 120) bpScore = 25;
        else if (sysAvg <= 129) bpScore = 20;
        else if (sysAvg <= 139) bpScore = 15;
        else bpScore = 10;
      }

      // 3. Activity points (max 20)
      const stepVals = recentLogs.filter((l) => l.steps != null).map((l) => Number(l.steps));
      if (stepVals.length > 0) {
        const avgSteps = stepVals.reduce((a, b) => a + b, 0) / stepVals.length;
        if (avgSteps >= 8000) activityScore = 20;
        else if (avgSteps >= 5000) activityScore = 16;
        else if (avgSteps >= 2500) activityScore = 12;
        else activityScore = 8;
      }

      // 4. Sleep points (max 15)
      const sleepVals = recentLogs
        .filter((l) => l.sleepHours != null || l.sleepDuration != null)
        .map((l) => Number(l.sleepHours ?? l.sleepDuration));
      if (sleepVals.length > 0) {
        const avgSleep = sleepVals.reduce((a, b) => a + b, 0) / sleepVals.length;
        if (avgSleep >= 7 && avgSleep <= 9) sleepScore = 15;
        else if (avgSleep >= 6) sleepScore = 12;
        else sleepScore = 8;
      }

      // 5. Adherence points (max 15)
      const daysLogged = recentLogs.length;
      if (daysLogged >= 5) adherenceScore = 15;
      else if (daysLogged >= 3) adherenceScore = 11;
      else adherenceScore = 7;
    }

    const totalScore = Math.min(
      100,
      glucoseScore + bpScore + activityScore + sleepScore + adherenceScore
    );

    let rating = "Good";
    let grade = "A";
    let scoreColor = "green";

    if (totalScore >= 90) {
      rating = "Optimal";
      grade = "A+";
      scoreColor = "green";
    } else if (totalScore >= 80) {
      rating = "Good";
      grade = "A";
      scoreColor = "green";
    } else if (totalScore >= 70) {
      rating = "Fair";
      grade = "B";
      scoreColor = "amber";
    } else if (totalScore >= 60) {
      rating = "Moderate";
      grade = "C";
      scoreColor = "amber";
    } else {
      rating = "Needs Attention";
      grade = "D";
      scoreColor = "red";
    }

    const weeklyHealthScore = {
      score: totalScore,
      maxScore: 100,
      rating,
      grade,
      scoreColor,
      daysLogged: recentLogs.length,
      breakdown: {
        glucose: glucoseScore,
        bloodPressure: bpScore,
        activity: activityScore,
        sleep: sleepScore,
        adherence: adherenceScore,
      },
    };

    return res.status(200).json({
      latestGlucose,
      latestBP,
      todaySteps,
      sleepDuration,
      weight,
      medicationStatus,
      weeklyHealthScore,
      totalLogsRecorded: logs.length,
    });
  } catch (error) {
    console.error("Dashboard summary error:", error);
    return res.status(500).json({
      error: "Failed to retrieve dashboard summary",
      message: error.message,
    });
  }
});

module.exports = router;
