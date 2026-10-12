const bcrypt = require("bcryptjs");
const prisma = require("../prismaClient");

async function seedDemoData() {
  console.log("\n=======================================================");
  console.log("   🌱 SEEDING MEDITWIN DEMONSTRATION ACCOUNT & TEST DATA");
  console.log("=======================================================\n");

  const demoEmail = "demo@meditwin.health";
  const demoPassword = "DemoPassword123!";

  try {
    // 1. Clean up existing demo user if present
    const existing = await prisma.user.findUnique({
      where: { email: demoEmail },
    });

    if (existing) {
      console.log(`▶ Purging previous demo account (${demoEmail})...`);
      const uid = existing.id;
      await prisma.dailyHealthLog.deleteMany({ where: { userId: uid } });
      await prisma.medication.deleteMany({ where: { userId: uid } });
      await prisma.scenarioSimulation.deleteMany({ where: { userId: uid } });
      await prisma.prediction.deleteMany({ where: { userId: uid } });
      await prisma.familyHistory.deleteMany({ where: { userId: uid } });
      await prisma.healthProfile.deleteMany({ where: { userId: uid } });
      await prisma.consent.deleteMany({ where: { userId: uid } });
      await prisma.auditLog.deleteMany({ where: { userId: uid } });
      await prisma.user.delete({ where: { id: uid } });
      console.log("  ✓ Previous demo account purged.");
    }

    // 2. Create Demo User
    console.log("▶ Creating demonstration account...");
    const passwordHash = await bcrypt.hash(demoPassword, 12);
    const user = await prisma.user.create({
      data: {
        email: demoEmail,
        fullName: "Alex Morgan",
        passwordHash,
        role: "patient",
      },
    });
    console.log(`  ✓ Demo User Created: ${user.fullName} (${user.email})`);

    // 3. Create Health Profile (Onboarding)
    console.log("▶ Seeding baseline health profile...");
    const healthProfile = await prisma.healthProfile.create({
      data: {
        userId: user.id,
        gender: "female",
        dateOfBirth: new Date("1984-06-15"),
        heightCm: 168,
        weightKg: 68.5,
        location: "Boston, MA",
        diabetesStatus: "Type 2",
        diabetesType: "Type 2 (Diet & Lifestyle Managed)",
        diagnosisYear: 2022,
        fastingGlucose: 112,
        hba1c: 6.4,
        bloodPressureHistory: "Pre-hypertension stage 1",
        cholesterol: "Borderline high (205 mg/dL)",
        heartHistory: "None",
        kidneyHistory: "Normal eGFR",
        typicalSleep: 6.5,
        typicalActivity: "moderate",
        foodPreference: "Mediterranean balanced",
        smoking: "non-smoker",
        alcohol: "social (occasional wine)",
      },
    });
    console.log("  ✓ Baseline Health Profile Created.");

    // 4. Create Medication
    console.log("▶ Seeding medication schedule...");
    const medication = await prisma.medication.create({
      data: {
        userId: user.id,
        name: "Metformin",
        dosage: "500 mg",
        frequency: "Once daily with dinner",
        instructions: "Take with meal to reduce stomach upset",
        isActive: true,
        startDate: new Date("2022-03-01"),
      },
    });
    console.log("  ✓ Medication Created: Metformin 500mg.");

    // 5. Seed 14 Days of Realistic Daily Health Logs
    console.log("▶ Seeding 14 consecutive days of realistic health logs...");
    const today = new Date();
    today.setHours(12, 0, 0, 0);

    const logTemplates = [
      { dayOffset: 13, glucose: 138, sys: 132, dia: 84, hr: 78, sleep: 5.5, steps: 4100, lateMeal: true, exercise: 0, medTaken: "Taken", alcohol: "none" },
      { dayOffset: 12, glucose: 142, sys: 130, dia: 82, hr: 76, sleep: 5.2, steps: 3900, lateMeal: true, exercise: 0, medTaken: "Taken", alcohol: "wine (1 glass)" },
      { dayOffset: 11, glucose: 118, sys: 124, dia: 78, hr: 72, sleep: 7.2, steps: 7800, lateMeal: false, exercise: 30, medTaken: "Taken", alcohol: "none" },
      { dayOffset: 10, glucose: 114, sys: 122, dia: 78, hr: 70, sleep: 7.5, steps: 8400, lateMeal: false, exercise: 40, medTaken: "Taken", alcohol: "none" },
      { dayOffset: 9,  glucose: 146, sys: 134, dia: 86, hr: 80, sleep: 5.4, steps: 3600, lateMeal: true, exercise: 0, medTaken: "Taken", alcohol: "wine (2 glasses)" },
      { dayOffset: 8,  glucose: 122, sys: 126, dia: 80, hr: 74, sleep: 6.8, steps: 6500, lateMeal: false, exercise: 25, medTaken: "Taken", alcohol: "none" },
      { dayOffset: 7,  glucose: 136, sys: 128, dia: 82, hr: 75, sleep: 5.8, steps: 4400, lateMeal: true, exercise: 0, medTaken: "Missed", missedReason: "Traveling, forgot dose", alcohol: "none" },
      { dayOffset: 6,  glucose: 112, sys: 120, dia: 76, hr: 68, sleep: 7.8, steps: 9100, lateMeal: false, exercise: 45, medTaken: "Taken", alcohol: "none" },
      { dayOffset: 5,  glucose: 110, sys: 118, dia: 76, hr: 69, sleep: 7.6, steps: 8700, lateMeal: false, exercise: 40, medTaken: "Taken", alcohol: "none" },
      { dayOffset: 4,  glucose: 144, sys: 132, dia: 84, hr: 79, sleep: 5.3, steps: 3800, lateMeal: true, exercise: 0, medTaken: "Taken", alcohol: "wine (1 glass)" },
      { dayOffset: 3,  glucose: 116, sys: 124, dia: 78, hr: 71, sleep: 7.1, steps: 7200, lateMeal: false, exercise: 30, medTaken: "Taken", alcohol: "none" },
      { dayOffset: 2,  glucose: 108, sys: 118, dia: 74, hr: 67, sleep: 8.0, steps: 9400, lateMeal: false, exercise: 50, medTaken: "Taken", alcohol: "none" },
      { dayOffset: 1,  glucose: 115, sys: 122, dia: 78, hr: 70, sleep: 7.0, steps: 8100, lateMeal: false, exercise: 35, medTaken: "Taken", alcohol: "none" },
      { dayOffset: 0,  glucose: 111, sys: 120, dia: 76, hr: 68, sleep: 7.4, steps: 8600, lateMeal: false, exercise: 40, medTaken: "Taken", alcohol: "none" },
    ];

    for (const t of logTemplates) {
      const logDate = new Date(today);
      logDate.setDate(logDate.getDate() - t.dayOffset);

      await prisma.dailyHealthLog.create({
        data: {
          userId: user.id,
          date: logDate,
          glucose: t.glucose,
          bpSystolic: t.sys,
          bpDiastolic: t.dia,
          heartRate: t.hr,
          weightKg: 68.5 - (t.dayOffset * 0.05),
          sleepHours: t.sleep,
          sleepDuration: t.sleep,
          sleepQuality: t.sleep >= 7 ? 4 : 2,
          sleepStartTime: t.lateMeal ? "01:30" : "23:00",
          wakeUpTime: "07:00",
          steps: t.steps,
          exerciseMinutes: t.exercise,
          exerciseType: t.exercise > 0 ? "Brisk walk & stretching" : null,
          sittingHours: t.steps < 5000 ? 8.5 : 5.0,
          waterLiters: 2.2,
          hasSugaryDrink: t.lateMeal,
          hasFriedFood: t.lateMeal,
          isHighCarb: t.lateMeal,
          hasVegetables: !t.lateMeal,
          mealSatisfaction: t.lateMeal ? 3 : 5,
          medicationName: "Metformin",
          medicationDosage: "500 mg",
          medicationTaken: t.medTaken,
          missedReason: t.missedReason || null,
          alcohol: t.alcohol,
          smoking: "none",
          stressLevel: t.sleep < 6 ? 4 : 2,
          energyLevel: t.sleep < 6 ? 2 : 4,
          notes: t.lateMeal
            ? "Late dinner with carbs and dessert. Shorter sleep."
            : "Balanced dinner with vegetables. 35-min brisk walk. Slept well.",
        },
      });
    }
    console.log("  ✓ 14 days of multi-metric health logs seeded.");

    // 6. Seed Presaved Lifestyle Simulations
    console.log("▶ Seeding preset lifestyle simulation scenarios...");
    await prisma.scenarioSimulation.create({
      data: {
        userId: user.id,
        name: "Add 2,000 steps daily",
        description: "Simulating +2,000 steps daily over baseline activity.",
        changes: {
          scenarioId: "add_2000_steps",
          stepDelta: 2000,
          currentSteps: 4200,
          simulatedSteps: 6200,
        },
        result: {
          currentAverage: "4,200 steps/day",
          simulatedAverage: "6,200 steps/day",
          estimatedResult: "likely improvement in activity consistency",
          confidence: "low",
          disclaimer: "Non-pharmacological observational heuristic. Do not alter medications.",
        },
      },
    });

    await prisma.scenarioSimulation.create({
      data: {
        userId: user.id,
        name: "Sleep one additional hour",
        description: "Simulating +1.0 hour of nightly sleep duration.",
        changes: {
          scenarioId: "sleep_additional_hour",
          sleepDelta: 1.0,
          currentSleep: 6.2,
          simulatedSleep: 7.2,
        },
        result: {
          currentAverage: "6.2 hours/day",
          simulatedAverage: "7.2 hours/day",
          estimatedResult: "likely improvement in sleep regularity and next-day energy consistency",
          confidence: "low",
          disclaimer: "Observational pattern estimation. Not a clinical treatment directive.",
        },
      },
    });

    await prisma.scenarioSimulation.create({
      data: {
        userId: user.id,
        name: "Avoid alcohol for seven days",
        description: "Simulating 7 consecutive alcohol-free days.",
        changes: {
          scenarioId: "avoid_alcohol_7_days",
          alcoholFreeDays: 7,
          currentAlcoholDays: 3,
          simulatedAlcoholDays: 0,
        },
        result: {
          currentAverage: "3 drinking days/week",
          simulatedAverage: "0 drinking days/week (7-day pause)",
          estimatedResult: "likely reduction in late-night glucose volatility",
          confidence: "low",
          disclaimer: "Non-clinical wellness simulation. Never adjust prescription medications.",
        },
      },
    });
    console.log("  ✓ 3 Lifestyle simulations seeded.");

    // 7. Seed Consents
    console.log("▶ Seeding user consent records...");
    await prisma.consent.create({
      data: {
        userId: user.id,
        consentType: "terms_and_privacy",
        granted: true,
        version: "1.0",
        grantedAt: new Date(),
      },
    });

    await prisma.consent.create({
      data: {
        userId: user.id,
        consentType: "research_use",
        granted: true,
        version: "1.0",
        grantedAt: new Date(),
      },
    });
    console.log("  ✓ Privacy and research-use consents seeded.");

    // 8. Seed Security Audit Logs
    console.log("▶ Seeding audit telemetry...");
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "LOGIN",
        entity: "User",
        entityId: user.id,
        ipAddress: "127.0.0.1",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128",
        details: { role: "patient" },
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "RESEARCH_CONSENT_GRANTED",
        entity: "Consent",
        ipAddress: "127.0.0.1",
        details: { consentType: "research_use", version: "1.0" },
      },
    });

    console.log("\n=======================================================");
    console.log("   🎉 DEMO ACCOUNT READY FOR DEMONSTRATION & EVALUATION");
    console.log("=======================================================");
    console.log("  Login Email   : demo@meditwin.health");
    console.log("  Login Password: DemoPassword123!");
    console.log("  Patient Name  : Alex Morgan");
    console.log("  Role          : patient");
    console.log("  Health Logs   : 14 Consecutive Days");
    console.log("  Simulations   : 3 Scenarios Pre-loaded");
    console.log("=======================================================\n");
  } catch (err) {
    console.error("❌ SEEDING FAILED:", err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

seedDemoData();
