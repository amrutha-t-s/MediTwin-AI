const prisma = require("../config/db");

// ======================================================
// CREATE DAILY HEALTH JOURNAL
// ======================================================

const createJournal = async (req, res) => {
  try {
    const userId = req.user.userId;

    const {
      date,
      glucose,
      systolicBP,
      diastolicBP,
      pulseRate,
      weight,
      waistCircumference,
      steps,
      exerciseMinutes,
      exerciseType,
      sittingHours,
      sleepStartTime,
      wakeUpTime,
      sleepDuration,
      sleep,
      sleepQuality,
      nightAwakenings,
      foodSummary,
      medication,
      exercise,
      mood,
      water,
      smoking,
      alcohol,
      notes,
    } = req.body;

    if (!date) {
      return res.status(400).json({
        error: "Journal date is required",
      });
    }

    const resolvedSleepDuration =
      sleepDuration !== "" && sleepDuration !== undefined
        ? Number(sleepDuration)
        : sleep !== "" && sleep !== undefined
        ? Number(sleep)
        : null;

    const journal = await prisma.dailyHealthLog.create({
      data: {
        userId,

        date: new Date(date),

        glucose:
          glucose !== "" && glucose !== undefined ? Number(glucose) : null,

        bpSystolic:
          systolicBP !== "" && systolicBP !== undefined
            ? Number(systolicBP)
            : null,

        bpDiastolic:
          diastolicBP !== "" && diastolicBP !== undefined
            ? Number(diastolicBP)
            : null,

        heartRate:
          pulseRate !== "" && pulseRate !== undefined
            ? Number(pulseRate)
            : null,

        weightKg:
          weight !== "" && weight !== undefined ? Number(weight) : null,

        waistCircumference:
          waistCircumference !== "" && waistCircumference !== undefined
            ? Number(waistCircumference)
            : null,

        steps: steps !== "" && steps !== undefined ? Number(steps) : null,

        exerciseMinutes:
          exerciseMinutes !== "" && exerciseMinutes !== undefined
            ? Number(exerciseMinutes)
            : null,

        exerciseType: exerciseType || null,

        sittingHours:
          sittingHours !== "" && sittingHours !== undefined
            ? Number(sittingHours)
            : null,

        exercise:
          exerciseType ||
          exercise ||
          (exerciseMinutes ? `${exerciseMinutes} mins` : null),

        sleepStartTime: sleepStartTime || null,

        wakeUpTime: wakeUpTime || null,

        sleepDuration: resolvedSleepDuration,

        sleepHours: resolvedSleepDuration,

        sleepQuality:
          sleepQuality !== "" && sleepQuality !== undefined
            ? Number(sleepQuality)
            : null,

        nightAwakenings:
          nightAwakenings !== "" && nightAwakenings !== undefined
            ? Number(nightAwakenings)
            : null,

        waterLiters: water !== "" && water !== undefined ? Number(water) : null,

        foodSummary: foodSummary || null,

        mood: mood || null,

        notes: notes || null,
      },
    });

    return res.status(201).json({
      message: "Daily health journal saved successfully",
      journal,
    });
  } catch (error) {
    console.error("CREATE JOURNAL ERROR:", error);

    return res.status(500).json({
      error: "Failed to save daily health journal",
      details: error.message,
    });
  }
};

// ======================================================
// GET ALL JOURNALS FOR LOGGED-IN USER
// ======================================================

const getJournals = async (req, res) => {
  try {
    const userId = req.user.userId;

    const journals = await prisma.dailyHealthLog.findMany({
      where: {
        userId,
      },
      orderBy: {
        date: "desc",
      },
    });

    return res.status(200).json({
      journals,
    });
  } catch (error) {
    console.error("GET JOURNALS ERROR:", error);

    return res.status(500).json({
      error: "Failed to load health journals",
      details: error.message,
    });
  }
};

module.exports = {
  createJournal,
  getJournals,
};
