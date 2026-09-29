const express = require("express");
const prisma = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ======================================================
// CREATE DAILY HEALTH JOURNAL
// POST /api/journal
// ======================================================

router.post("/", authMiddleware, async (req, res) => {
  try {
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

      // Day 19 - Food Entry
      breakfast,
      breakfastTime,
      breakfastPortion,
      breakfastSugaryDrink,
      breakfastFriedFood,
      breakfastHighCarb,
      breakfastVegetables,
      breakfastSatisfaction,

      lunch,
      lunchTime,
      lunchPortion,
      lunchSugaryDrink,
      lunchFriedFood,
      lunchHighCarb,
      lunchVegetables,
      lunchSatisfaction,

      dinner,
      dinnerTime,
      dinnerPortion,
      dinnerSugaryDrink,
      dinnerFriedFood,
      dinnerHighCarb,
      dinnerVegetables,
      dinnerSatisfaction,

      snacks,
      snacksTime,
      snacksPortion,
      snacksSugaryDrink,
      snacksFriedFood,
      snacksHighCarb,
      snacksVegetables,
      snacksSatisfaction,

      hasSugaryDrink,
      hasFriedFood,
      isHighCarb,
      hasVegetables,
      mealSatisfaction,
      foodDetails,

      medication,
      water,
      smoking,
      alcohol,
      notes,
    } = req.body;

    if (!date) {
      return res.status(400).json({
        message: "Date is required",
      });
    }

    const structuredFoodDetails = foodDetails || {
      breakfast: {
        food: breakfast || "",
        time: breakfastTime || "",
        portion: breakfastPortion || "",
        sugaryDrink: !!breakfastSugaryDrink,
        friedFood: !!breakfastFriedFood,
        highCarb: !!breakfastHighCarb,
        vegetables: !!breakfastVegetables,
        satisfaction:
          breakfastSatisfaction !== "" && breakfastSatisfaction != null
            ? Number(breakfastSatisfaction)
            : null,
      },
      lunch: {
        food: lunch || "",
        time: lunchTime || "",
        portion: lunchPortion || "",
        sugaryDrink: !!lunchSugaryDrink,
        friedFood: !!lunchFriedFood,
        highCarb: !!lunchHighCarb,
        vegetables: !!lunchVegetables,
        satisfaction:
          lunchSatisfaction !== "" && lunchSatisfaction != null
            ? Number(lunchSatisfaction)
            : null,
      },
      dinner: {
        food: dinner || "",
        time: dinnerTime || "",
        portion: dinnerPortion || "",
        sugaryDrink: !!dinnerSugaryDrink,
        friedFood: !!dinnerFriedFood,
        highCarb: !!dinnerHighCarb,
        vegetables: !!dinnerVegetables,
        satisfaction:
          dinnerSatisfaction !== "" && dinnerSatisfaction != null
            ? Number(dinnerSatisfaction)
            : null,
      },
      snacks: {
        food: snacks || "",
        time: snacksTime || "",
        portion: snacksPortion || "",
        sugaryDrink: !!snacksSugaryDrink,
        friedFood: !!snacksFriedFood,
        highCarb: !!snacksHighCarb,
        vegetables: !!snacksVegetables,
        satisfaction:
          snacksSatisfaction !== "" && snacksSatisfaction != null
            ? Number(snacksSatisfaction)
            : null,
      },
    };

    const resolvedSugaryDrink =
      hasSugaryDrink !== undefined
        ? Boolean(hasSugaryDrink)
        : !!(
            breakfastSugaryDrink ||
            lunchSugaryDrink ||
            dinnerSugaryDrink ||
            snacksSugaryDrink
          );

    const resolvedFriedFood =
      hasFriedFood !== undefined
        ? Boolean(hasFriedFood)
        : !!(
            breakfastFriedFood ||
            lunchFriedFood ||
            dinnerFriedFood ||
            snacksFriedFood
          );

    const resolvedHighCarb =
      isHighCarb !== undefined
        ? Boolean(isHighCarb)
        : !!(
            breakfastHighCarb ||
            lunchHighCarb ||
            dinnerHighCarb ||
            snacksHighCarb
          );

    const resolvedVegetables =
      hasVegetables !== undefined
        ? Boolean(hasVegetables)
        : !!(
            breakfastVegetables ||
            lunchVegetables ||
            dinnerVegetables ||
            snacksVegetables
          );

    const formatMealText = (
      label,
      food,
      time,
      portion,
      flags,
      satisfaction
    ) => {
      if (!food && !time) return "";
      const meta = [];
      if (time) meta.push(`Time: ${time}`);
      if (portion) meta.push(`Portion: ${portion}`);
      if (satisfaction) meta.push(`Satisfaction: ${satisfaction}/5`);
      const flagList = [];
      if (flags?.sugaryDrink) flagList.push("Sugary drink");
      if (flags?.friedFood) flagList.push("Fried food");
      if (flags?.highCarb) flagList.push("High-carb");
      if (flags?.vegetables) flagList.push("Veggie-rich");
      if (flagList.length) meta.push(`Tags: ${flagList.join(", ")}`);

      return `${label}: ${food || "Recorded"}${meta.length ? ` (${meta.join(" | ")})` : ""}`;
    };

    const foodSummary = [
      formatMealText(
        "Breakfast",
        breakfast,
        breakfastTime,
        breakfastPortion,
        {
          sugaryDrink: breakfastSugaryDrink,
          friedFood: breakfastFriedFood,
          highCarb: breakfastHighCarb,
          vegetables: breakfastVegetables,
        },
        breakfastSatisfaction
      ),
      formatMealText(
        "Lunch",
        lunch,
        lunchTime,
        lunchPortion,
        {
          sugaryDrink: lunchSugaryDrink,
          friedFood: lunchFriedFood,
          highCarb: lunchHighCarb,
          vegetables: lunchVegetables,
        },
        lunchSatisfaction
      ),
      formatMealText(
        "Dinner",
        dinner,
        dinnerTime,
        dinnerPortion,
        {
          sugaryDrink: dinnerSugaryDrink,
          friedFood: dinnerFriedFood,
          highCarb: dinnerHighCarb,
          vegetables: dinnerVegetables,
        },
        dinnerSatisfaction
      ),
      formatMealText(
        "Snacks",
        snacks,
        snacksTime,
        snacksPortion,
        {
          sugaryDrink: snacksSugaryDrink,
          friedFood: snacksFriedFood,
          highCarb: snacksHighCarb,
          vegetables: snacksVegetables,
        },
        snacksSatisfaction
      ),
    ]
      .filter(Boolean)
      .join("\n");

    const lifestyle = [
      smoking ? `Smoking: ${smoking}` : "",
      alcohol ? `Alcohol: ${alcohol}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const finalNotes = [
      medication ? `Medication: ${medication}` : "",
      lifestyle,
      notes || "",
    ]
      .filter(Boolean)
      .join("\n");

    const resolvedSleepDuration =
      sleepDuration !== "" && sleepDuration != null
        ? Number(sleepDuration)
        : sleep !== "" && sleep != null
        ? Number(sleep)
        : null;

    const journal = await prisma.dailyHealthLog.create({
      data: {
        userId: req.user.userId,

        date: new Date(date),

        // Day 16 - Glucose
        glucose: glucose !== "" && glucose != null ? Number(glucose) : null,

        // Day 17 - BP & Vitals
        bpSystolic:
          systolicBP !== "" && systolicBP != null ? Number(systolicBP) : null,

        bpDiastolic:
          diastolicBP !== "" && diastolicBP != null
            ? Number(diastolicBP)
            : null,

        heartRate:
          pulseRate !== "" && pulseRate != null ? Number(pulseRate) : null,

        weightKg: weight !== "" && weight != null ? Number(weight) : null,

        waistCircumference:
          waistCircumference !== "" && waistCircumference != null
            ? Number(waistCircumference)
            : null,

        // Day 18 - Activity
        steps: steps !== "" && steps != null ? Number(steps) : null,

        exerciseMinutes:
          exerciseMinutes !== "" && exerciseMinutes != null
            ? Number(exerciseMinutes)
            : null,

        exerciseType: exerciseType || null,

        sittingHours:
          sittingHours !== "" && sittingHours != null
            ? Number(sittingHours)
            : null,

        exercise:
          exerciseType ||
          (exerciseMinutes ? `${exerciseMinutes} mins` : null),

        // Day 18 - Sleep
        sleepStartTime: sleepStartTime || null,

        wakeUpTime: wakeUpTime || null,

        sleepDuration: resolvedSleepDuration,

        sleepHours: resolvedSleepDuration,

        sleepQuality:
          sleepQuality !== "" && sleepQuality != null
            ? Number(sleepQuality)
            : null,

        nightAwakenings:
          nightAwakenings !== "" && nightAwakenings != null
            ? Number(nightAwakenings)
            : null,

        // Food & Lifestyle
        waterLiters: water !== "" && water != null ? Number(water) : null,

        // Day 19 - Food Entry
        foodSummary: foodSummary || null,
        foodDetails: structuredFoodDetails,
        hasSugaryDrink: resolvedSugaryDrink,
        hasFriedFood: resolvedFriedFood,
        isHighCarb: resolvedHighCarb,
        hasVegetables: resolvedVegetables,
        mealSatisfaction:
          mealSatisfaction !== "" && mealSatisfaction != null
            ? Number(mealSatisfaction)
            : null,

        notes: finalNotes || null,
      },
    });

    console.log("Journal saved successfully:", journal.id);

    return res.status(201).json({
      message: "Daily health journal saved successfully",
      journal,
    });
  } catch (error) {
    console.error("Journal save error:", error);

    return res.status(500).json({
      message: "Failed to save daily health journal",
      error: error.message,
    });
  }
});

// ======================================================
// GET DAILY HEALTH JOURNALS
// GET /api/journal
// ======================================================

router.get("/", authMiddleware, async (req, res) => {
  try {
    const journals = await prisma.dailyHealthLog.findMany({
      where: {
        userId: req.user.userId,
      },
      orderBy: {
        date: "desc",
      },
    });

    return res.status(200).json(journals);
  } catch (error) {
    console.error("Journal fetch error:", error);

    return res.status(500).json({
      message: "Failed to fetch daily health journals",
      error: error.message,
    });
  }
});

module.exports = router;
