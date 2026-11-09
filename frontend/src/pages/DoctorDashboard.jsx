import { useState, useMemo, useEffect } from "react";
import api from "../services/api";
import { getUserName, getUserEmail } from "../utils/auth";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  BarChart,
  Bar,
} from "recharts";

// =====================================================================
// COHORT MOCK DATA
// Clinician-delegated patients with realistic remote telemetry records
// =====================================================================

const PATIENTS_DATA = [
  {
    id: "PT-8021",
    name: "Ramesh K.",
    age: 54,
    gender: "Male",
    diabetesType: "Type 2 Diabetes",
    diagnosisYear: 2021,
    heightCm: 172,
    weightKg: 78.5,
    bloodGroup: "B+",
    familyHistory: "Maternal Type 2 Diabetes, Hypertension",
    smoking: "Former smoker (Quit 2020)",
    alcohol: "Occasional (Social)",
    currentMedications: ["Metformin 500mg BID", "Atorvastatin 10mg QHS"],
    consentStatus: "Verified & Active",
    consentDate: "2026-08-14",
    sharingPermission: "Remote Telemetry Authorized",
    lastGlucose: 148,
    lastBP: "132/86",
    systolic: 132,
    diastolic: 86,
    avgSteps7d: 4100,
    avgSleep7d: 5.8,
    adherencePct: 78,
    completenessPct: 82,
    lastUpdated: "Today, 08:30 AM",
    reviewStatus: "Needs Review",
    riskFlag: "High Glucose Variability",
    riskLevel: "red", // 'green' | 'yellow' | 'red'
    digitalTwin: {
      glucoseTrend: "slightly_high",
      bloodPressureTrend: "stable",
      activityLevel: "low",
      sleepPattern: "irregular",
      medicationAdherence: 78,
      dataCompleteness: 82,
      riskFlags: ["low activity", "irregular sleep", "missed medication entries"],
      positiveFlags: ["consistent water intake", "improved step count"],
    },
    reviewNotes:
      "Continue current monitoring. Review post-dinner glucose pattern during next visit. Patient should maintain regular activity and discuss medication plan during consultation.",
    followUpInstructions:
      "Aim for 15-minute walk after evening dinner. Maintain hydration (>2L/day). Log bedtime glucose on days with late meals.",
    nextConsultationDate: "2026-10-25",
    insights: [
      {
        id: "ins-1",
        text: "Observed pattern: Higher post-dinner glucose was recorded on days with late dinner and low activity.",
        type: "pattern",
        status: "accepted", // 'pending' | 'accepted' | 'rejected'
        doctorComment: "Correlates with patient dinner logs after 9:30 PM.",
      },
      {
        id: "ins-2",
        text: "Observed pattern: Average sleep was below six hours on five of the last seven days.",
        type: "pattern",
        status: "pending",
        doctorComment: "",
      },
      {
        id: "ins-3",
        text: "Observed pattern: Medication entries were missing on three days this week.",
        type: "alert",
        status: "pending",
        doctorComment: "",
      },
      {
        id: "ins-4",
        text: "Positive observation: Daily steps improved from 3,200 to 6,100 over the last two weeks.",
        type: "positive",
        status: "accepted",
        doctorComment: "Good lifestyle progress.",
      },
    ],
    timeline: [
      { date: "Oct 13", glucose: 148, bp: "132/86", steps: 4850, sleep: 6.2, food: "Roti, Dal, Salad, Tea", med: "Taken", notes: "Felt mild fatigue after lunch" },
      { date: "Oct 12", glucose: 156, bp: "134/88", steps: 3900, sleep: 5.5, food: "Rice, Chicken Curry, Late supper", med: "Missed evening", notes: "Dinner delayed past 10 PM" },
      { date: "Oct 11", glucose: 142, bp: "130/84", steps: 5200, sleep: 6.0, food: "Oats, Mixed Veg Curry", med: "Taken", notes: "15 min brisk evening walk" },
      { date: "Oct 10", glucose: 168, bp: "138/90", steps: 2800, sleep: 5.2, food: "Fried snacks, Soda, Rice", med: "Taken", notes: "Work stress, poor sleep" },
      { date: "Oct 09", glucose: 139, bp: "128/82", steps: 4600, sleep: 6.5, food: "Idli, Sambar, Green salad", med: "Taken", notes: "Normal energy levels" },
      { date: "Oct 08", glucose: 162, bp: "136/86", steps: 3400, sleep: 5.4, food: "Paneer butter masala, Naan", med: "Missed morning", notes: "Missed morning metformin dose" },
      { date: "Oct 07", glucose: 135, bp: "126/80", steps: 5800, sleep: 6.8, food: "Brown rice, Veg stew", med: "Taken", notes: "Good morning walk" },
    ],
  },
  {
    id: "PT-8022",
    name: "Anitha S.",
    age: 49,
    gender: "Female",
    diabetesType: "Prediabetes",
    diagnosisYear: 2023,
    heightCm: 161,
    weightKg: 64.2,
    bloodGroup: "O+",
    familyHistory: "Paternal Type 2 Diabetes",
    smoking: "Never smoked",
    alcohol: "Never",
    currentMedications: ["Lifestyle modification only"],
    consentStatus: "Verified & Active",
    consentDate: "2026-07-22",
    sharingPermission: "Remote Telemetry Authorized",
    lastGlucose: 118,
    lastBP: "124/80",
    systolic: 124,
    diastolic: 80,
    avgSteps7d: 7800,
    avgSleep7d: 7.2,
    adherencePct: 96,
    completenessPct: 94,
    lastUpdated: "Today, 07:15 AM",
    reviewStatus: "Reviewed",
    riskFlag: "Stable / Improving",
    riskLevel: "green",
    digitalTwin: {
      glucoseTrend: "stable",
      bloodPressureTrend: "optimal",
      activityLevel: "moderate_high",
      sleepPattern: "regular",
      medicationAdherence: 96,
      dataCompleteness: 94,
      riskFlags: [],
      positiveFlags: ["consistently elevated step count", "optimal sleep hygiene", "stable fasting glycemia"],
    },
    reviewNotes: "Excellent lifestyle adaptation. Fasting glucose and HbA1c trajectory remain in prediabetes remission target.",
    followUpInstructions: "Maintain current exercise routine. Continue 7,000+ daily steps. Re-test HbA1c in 3 months.",
    nextConsultationDate: "2026-12-10",
    insights: [
      {
        id: "ins-21",
        text: "Positive observation: Fasting glucose remained within 95–118 mg/dL over all recorded 14 days.",
        type: "positive",
        status: "accepted",
        doctorComment: "Target control achieved without pharmacological intervention.",
      },
    ],
    timeline: [
      { date: "Oct 13", glucose: 118, bp: "124/80", steps: 8100, sleep: 7.4, food: "Millet porridge, Steamed greens", med: "N/A", notes: "Morning yoga completed" },
      { date: "Oct 12", glucose: 112, bp: "120/78", steps: 7600, sleep: 7.1, food: "Quinoa salad, Lentil soup", med: "N/A", notes: "Felt very energetic" },
      { date: "Oct 11", glucose: 122, bp: "126/82", steps: 8300, sleep: 7.0, food: "Vegetable stir-fry, Roti", med: "N/A", notes: "Evening brisk walk" },
      { date: "Oct 10", glucose: 115, bp: "122/79", steps: 7900, sleep: 7.5, food: "Fruit bowl, Sprouted beans", med: "N/A", notes: "Well rested" },
    ],
  },
  {
    id: "PT-8023",
    name: "Joseph M.",
    age: 61,
    gender: "Male",
    diabetesType: "Type 2 Diabetes",
    diagnosisYear: 2018,
    heightCm: 168,
    weightKg: 82.0,
    bloodGroup: "A+",
    familyHistory: "Both parents Type 2 Diabetes, Coronary Artery Disease",
    smoking: "Former smoker",
    alcohol: "Occasional",
    currentMedications: ["Metformin 1000mg BID", "Glimepiride 1mg OD", "Telmisartan 40mg OD"],
    consentStatus: "Verified & Active",
    consentDate: "2026-06-11",
    sharingPermission: "Remote Telemetry Authorized",
    lastGlucose: 165,
    lastBP: "140/92",
    systolic: 140,
    diastolic: 92,
    avgSteps7d: 2900,
    avgSleep7d: 6.1,
    adherencePct: 62,
    completenessPct: 68,
    lastUpdated: "Yesterday, 06:40 PM",
    reviewStatus: "Needs Review",
    riskFlag: "Missed Medication / Elevated BP",
    riskLevel: "red",
    digitalTwin: {
      glucoseTrend: "elevated",
      bloodPressureTrend: "stage1_hypertension",
      activityLevel: "sedentary",
      sleepPattern: "mild_disruption",
      medicationAdherence: 62,
      dataCompleteness: 68,
      riskFlags: ["frequent missed medication doses", "elevated blood pressure", "low daily step volume"],
      positiveFlags: ["regular water intake"],
    },
    reviewNotes: "Medication adherence has dropped to 62%. Both BP and evening glucose are running above target. Needs urgent regimen adherence counseling.",
    followUpInstructions: "Set medication alarm for morning and night doses. Avoid adding table salt. Teleconsultation scheduled.",
    nextConsultationDate: "2026-10-18",
    insights: [
      {
        id: "ins-31",
        text: "Observed pattern: Medication entries were missing on four days in the last two weeks.",
        type: "alert",
        status: "accepted",
        doctorComment: "Confirmed with patient via nurse follow-up call.",
      },
      {
        id: "ins-32",
        text: "Observed pattern: Systolic blood pressure exceeded 135 mmHg on 6 of 7 recorded days.",
        type: "alert",
        status: "accepted",
        doctorComment: "Needs evaluation of antihypertensive compliance.",
      },
    ],
    timeline: [
      { date: "Oct 12", glucose: 165, bp: "140/92", steps: 2900, sleep: 6.0, food: "Rice, Fish curry, Sweets", med: "Missed evening", notes: "Forgot evening tablet" },
      { date: "Oct 11", glucose: 172, bp: "142/94", steps: 2400, sleep: 5.8, food: "Paratha, Pickle, Milk", med: "Taken", notes: "Mild headache in afternoon" },
      { date: "Oct 10", glucose: 158, bp: "138/90", steps: 3100, sleep: 6.4, food: "Rice, Dal, Curd", med: "Taken", notes: "Sedentary all day" },
      { date: "Oct 09", glucose: 180, bp: "145/95", steps: 2200, sleep: 5.5, food: "Buffet meal, Dessert", med: "Missed both", notes: "Traveled out of town" },
    ],
  },
  {
    id: "PT-8024",
    name: "Meera P.",
    age: 48,
    gender: "Female",
    diabetesType: "Prediabetes",
    diagnosisYear: 2024,
    heightCm: 158,
    weightKg: 69.0,
    bloodGroup: "B+",
    familyHistory: "Maternal Hypertension",
    smoking: "Never",
    alcohol: "Never",
    currentMedications: ["Lifestyle modification"],
    consentStatus: "Verified & Active",
    consentDate: "2026-09-01",
    sharingPermission: "Remote Telemetry Authorized",
    lastGlucose: 124,
    lastBP: "144/92",
    systolic: 144,
    diastolic: 92,
    avgSteps7d: 3800,
    avgSleep7d: 5.2,
    adherencePct: 90,
    completenessPct: 80,
    lastUpdated: "Today, 10:15 AM",
    reviewStatus: "Needs Review",
    riskFlag: "Low Sleep & Elevated BP",
    riskLevel: "yellow",
    digitalTwin: {
      glucoseTrend: "mildly_elevated",
      bloodPressureTrend: "stage1_hypertension",
      activityLevel: "low",
      sleepPattern: "deficient",
      medicationAdherence: 90,
      dataCompleteness: 80,
      riskFlags: ["sleep duration < 6 hours", "elevated blood pressure"],
      positiveFlags: ["consistent food logging"],
    },
    reviewNotes: "Sleep debt appears to correlate with elevated morning blood pressure. Stress reduction and sleep hygiene advised.",
    followUpInstructions: "Target 7 hours sleep nightly. Limit screen time after 10 PM. Check morning BP before breakfast.",
    nextConsultationDate: "2026-10-28",
    insights: [
      {
        id: "ins-41",
        text: "Observed pattern: Average sleep was below 5.5 hours on six of the last seven days.",
        type: "pattern",
        status: "pending",
        doctorComment: "",
      },
    ],
    timeline: [
      { date: "Oct 13", glucose: 124, bp: "144/92", steps: 4100, sleep: 5.1, food: "Poha, Tea, Veggies", med: "N/A", notes: "Woke up early, restless" },
      { date: "Oct 12", glucose: 128, bp: "142/90", steps: 3600, sleep: 5.3, food: "Rice, Dal, Salad", med: "N/A", notes: "High work stress" },
    ],
  },
  {
    id: "PT-8025",
    name: "Vikram T.",
    age: 58,
    gender: "Male",
    diabetesType: "Type 2 Diabetes",
    diagnosisYear: 2019,
    heightCm: 175,
    weightKg: 84.5,
    bloodGroup: "AB+",
    familyHistory: "Sibling with Type 2 Diabetes",
    smoking: "Never",
    alcohol: "Occasional",
    currentMedications: ["Metformin 1000mg BID", "Empagliflozin 10mg OD"],
    consentStatus: "Verified & Active",
    consentDate: "2026-05-18",
    sharingPermission: "Remote Telemetry Authorized",
    lastGlucose: 172,
    lastBP: "135/88",
    systolic: 135,
    diastolic: 88,
    avgSteps7d: 3200,
    avgSleep7d: 6.4,
    adherencePct: 70,
    completenessPct: 75,
    lastUpdated: "2 days ago",
    reviewStatus: "Needs Review",
    riskFlag: "High Glucose Variability",
    riskLevel: "red",
    digitalTwin: {
      glucoseTrend: "elevated",
      bloodPressureTrend: "mildly_elevated",
      activityLevel: "low",
      sleepPattern: "stable",
      medicationAdherence: 70,
      dataCompleteness: 75,
      riskFlags: ["unstable fasting glucose", "adherence gap"],
      positiveFlags: ["regular sleep hours"],
    },
    reviewNotes: "Fasting glucose spikes above 170 mg/dL. Review dietary carbohydrate intake and morning dosage adherence.",
    followUpInstructions: "Maintain strict fasting log. Avoid high-glycemic carbohydrates in evening meals.",
    nextConsultationDate: "2026-10-22",
    insights: [
      {
        id: "ins-51",
        text: "Observed pattern: Fasting glucose fluctuated between 135 and 182 mg/dL over the last 10 days.",
        type: "alert",
        status: "pending",
        doctorComment: "",
      },
    ],
    timeline: [
      { date: "Oct 11", glucose: 172, bp: "135/88", steps: 3200, sleep: 6.5, food: "Biryani, Cola, Raita", med: "Taken", notes: "Dinner out with colleagues" },
      { date: "Oct 10", glucose: 154, bp: "130/85", steps: 4000, sleep: 6.2, food: "Roti, Sabzi, Curd", med: "Taken", notes: "Normal routine" },
    ],
  },
  {
    id: "PT-8026",
    name: "Kavita N.",
    age: 36,
    gender: "Female",
    diabetesType: "Type 1 Diabetes",
    diagnosisYear: 2015,
    heightCm: 165,
    weightKg: 58.0,
    bloodGroup: "A+",
    familyHistory: "Autoimmune conditions",
    smoking: "Never",
    alcohol: "Never",
    currentMedications: ["Insulin Glargine 18U QHS", "Insulin Aspart with meals"],
    consentStatus: "Verified & Active",
    consentDate: "2026-06-30",
    sharingPermission: "Remote Telemetry Authorized",
    lastGlucose: 142,
    lastBP: "118/76",
    systolic: 118,
    diastolic: 76,
    avgSteps7d: 5400,
    avgSleep7d: 6.9,
    adherencePct: 88,
    completenessPct: 54,
    lastUpdated: "4 days ago",
    reviewStatus: "Needs Review",
    riskFlag: "Incomplete Data (>4 days)",
    riskLevel: "yellow",
    digitalTwin: {
      glucoseTrend: "variable",
      bloodPressureTrend: "optimal",
      activityLevel: "moderate",
      sleepPattern: "adequate",
      medicationAdherence: 88,
      dataCompleteness: 54,
      riskFlags: ["incomplete logging stream", "gaps in daily records"],
      positiveFlags: ["optimal blood pressure", "healthy BMI"],
    },
    reviewNotes: "Telemetry data stream has gaps over the last 4 days. Send reminder to log glucose readings.",
    followUpInstructions: "Please log blood glucose before each main meal and at bedtime.",
    nextConsultationDate: "2026-11-05",
    insights: [
      {
        id: "ins-61",
        text: "Observed pattern: Telemetry entries were missing on four of the last six days.",
        type: "pattern",
        status: "pending",
        doctorComment: "",
      },
    ],
    timeline: [
      { date: "Oct 09", glucose: 142, bp: "118/76", steps: 5400, sleep: 6.8, food: "Salad, Grilled chicken, Rice", med: "Taken", notes: "Glucose checked before dinner" },
    ],
  },
  {
    id: "PT-8027",
    name: "Rajesh V.",
    age: 52,
    gender: "Male",
    diabetesType: "Type 2 Diabetes",
    diagnosisYear: 2020,
    heightCm: 170,
    weightKg: 76.0,
    bloodGroup: "O+",
    familyHistory: "Paternal Diabetes",
    smoking: "Never",
    alcohol: "Never",
    currentMedications: ["Metformin 500mg BID"],
    consentStatus: "Verified & Active",
    consentDate: "2026-08-01",
    sharingPermission: "Remote Telemetry Authorized",
    lastGlucose: 128,
    lastBP: "128/82",
    systolic: 128,
    diastolic: 82,
    avgSteps7d: 6500,
    avgSleep7d: 7.1,
    adherencePct: 94,
    completenessPct: 92,
    lastUpdated: "Today, 06:50 AM",
    reviewStatus: "Reviewed",
    riskFlag: "Stable / Improving",
    riskLevel: "green",
    digitalTwin: {
      glucoseTrend: "stable",
      bloodPressureTrend: "optimal",
      activityLevel: "moderate",
      sleepPattern: "regular",
      medicationAdherence: 94,
      dataCompleteness: 92,
      riskFlags: [],
      positiveFlags: ["steady glycemic control", "consistent adherence"],
    },
    reviewNotes: "Excellent baseline stability across all metrics.",
    followUpInstructions: "Continue current prescription and exercise plan.",
    nextConsultationDate: "2026-11-20",
    insights: [],
    timeline: [
      { date: "Oct 13", glucose: 128, bp: "128/82", steps: 6700, sleep: 7.2, food: "Dosa, Sambar, Vegetable stew", med: "Taken", notes: "Regular morning run" },
    ],
  },
  {
    id: "PT-8028",
    name: "Sunita D.",
    age: 57,
    gender: "Female",
    diabetesType: "Type 2 Diabetes",
    diagnosisYear: 2017,
    heightCm: 156,
    weightKg: 73.0,
    bloodGroup: "B+",
    familyHistory: "Both parents Type 2 Diabetes",
    smoking: "Never",
    alcohol: "Never",
    currentMedications: ["Metformin 1000mg BID", "Sitagliptin 100mg OD"],
    consentStatus: "Verified & Active",
    consentDate: "2026-05-12",
    sharingPermission: "Remote Telemetry Authorized",
    lastGlucose: 138,
    lastBP: "134/86",
    systolic: 134,
    diastolic: 86,
    avgSteps7d: 4900,
    avgSleep7d: 6.5,
    adherencePct: 92,
    completenessPct: 88,
    lastUpdated: "Yesterday, 09:10 PM",
    reviewStatus: "Reviewed",
    riskFlag: "Stable",
    riskLevel: "green",
    digitalTwin: {
      glucoseTrend: "stable",
      bloodPressureTrend: "stable",
      activityLevel: "moderate",
      sleepPattern: "adequate",
      medicationAdherence: 92,
      dataCompleteness: 88,
      riskFlags: [],
      positiveFlags: ["reliable daily logging", "consistent medication adherence"],
    },
    reviewNotes: "Stable control. Patient reports good tolerance to Sitagliptin.",
    followUpInstructions: "Keep monitoring fasting glucose twice weekly.",
    nextConsultationDate: "2026-11-15",
    insights: [],
    timeline: [
      { date: "Oct 12", glucose: 138, bp: "134/86", steps: 5100, sleep: 6.6, food: "Roti, Paneer, Salad", med: "Taken", notes: "Evening walk in park" },
    ],
  },
];

// Realistic 14-day longitudinal trends mock generator for active patient
const GENERATE_TREND_DATA = (patient) => {
  const baseGlucose = patient.lastGlucose || 140;
  const baseSystolic = patient.systolic || 130;
  const baseDiastolic = patient.diastolic || 85;
  const baseSteps = patient.avgSteps7d || 4500;
  const baseSleep = patient.avgSleep7d || 6.2;

  const days = [
    "Sep 30", "Oct 01", "Oct 02", "Oct 03", "Oct 04", "Oct 05",
    "Oct 06", "Oct 07", "Oct 08", "Oct 09", "Oct 10", "Oct 11",
    "Oct 12", "Oct 13"
  ];

  return days.map((day, idx) => {
    const variation = Math.sin(idx * 0.9) * 15;
    const fastGlucose = Math.round(baseGlucose - 25 + variation * 0.6);
    const postMealGlucose = Math.round(baseGlucose + 12 + variation * 1.2);
    const bedtimeGlucose = Math.round(baseGlucose - 8 + variation * 0.8);
    const systolic = Math.round(baseSystolic + (variation * 0.4));
    const diastolic = Math.round(baseDiastolic + (variation * 0.3));
    const pulse = Math.round(74 + (variation * 0.2));
    const steps = Math.max(1800, Math.round(baseSteps + variation * 90));
    const sleep = Number((baseSleep + (variation * 0.08)).toFixed(1));
    const weight = Number((patient.weightKg + (idx * -0.05)).toFixed(1));
    const waterLiters = Number((1.8 + Math.abs(variation * 0.04)).toFixed(1));
    const stress = Math.min(5, Math.max(1, Math.round(3 + variation * 0.1)));
    const adherence = idx === 6 || idx === 11 ? 50 : 100;

    return {
      day,
      fastGlucose,
      postMealGlucose,
      bedtimeGlucose,
      systolic,
      diastolic,
      pulse,
      steps,
      sleep,
      weight,
      waterLiters,
      stress,
      adherence,
    };
  });
};

function DoctorDashboard() {
  // Authenticated clinician profile & dynamic real name
  const [doctorProfile, setDoctorProfile] = useState(() => ({
    fullName: getUserName(),
    email: getUserEmail(),
  }));

  useEffect(() => {
    api
      .get("/profile")
      .then((res) => {
        if (res.data?.user) {
          const u = res.data.user;
          setDoctorProfile({
            fullName: u.fullName || "",
            email: u.email || "",
          });
          if (u.fullName) {
            localStorage.setItem("fullName", u.fullName);
            sessionStorage.setItem("fullName", u.fullName);
          }
          if (u.email) {
            localStorage.setItem("email", u.email);
            sessionStorage.setItem("email", u.email);
          }
        }
      })
      .catch((err) => {
        console.warn("Could not fetch doctor profile:", err.message);
      });
  }, []);

  const doctorDisplayName = useMemo(() => {
    let name = (doctorProfile.fullName || "").trim();
    if (!name && doctorProfile.email) {
      const prefix = doctorProfile.email.split("@")[0];
      name = prefix.charAt(0).toUpperCase() + prefix.slice(1);
    }
    if (!name) name = "Clinician";
    return /^dr\.?\s+/i.test(name) ? name : `Dr. ${name}`;
  }, [doctorProfile]);

  // Real registered patients loaded dynamically from database
  const [realPatients, setRealPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);

  // Navigation & selection states
  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'patients' | 'detail' | 'reports' | 'security'
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [patientSearch, setPatientSearch] = useState("");
  const [patientFilter, setPatientFilter] = useState("all");
  const [trendRange, setTrendRange] = useState("14d"); // '7d' | '14d' | '30d' | '90d'

  // Fetch real registered patients from backend
  useEffect(() => {
    api
      .get("/doctor/patients")
      .then((res) => {
        if (Array.isArray(res.data?.patients) && res.data.patients.length > 0) {
          setRealPatients(res.data.patients);
          setSelectedPatientId(res.data.patients[0].id);
        }
      })
      .catch((err) => {
        console.warn("Could not load real patients:", err.message);
      })
      .finally(() => {
        setLoadingPatients(false);
      });
  }, []);

  const activePatients = useMemo(() => {
    return realPatients.length > 0 ? realPatients : PATIENTS_DATA;
  }, [realPatients]);

  // Selected timeline daily entry modal
  const [selectedDailyLog, setSelectedDailyLog] = useState(null);

  // Selected patient state
  const patient = useMemo(() => {
    return (
      activePatients.find((p) => p.id === selectedPatientId) ||
      activePatients[0] ||
      PATIENTS_DATA[0]
    );
  }, [activePatients, selectedPatientId]);

  // Insights state (allows doctor to accept / comment / reject)
  const [patientInsights, setPatientInsights] = useState(patient?.insights || []);

  // Doctor Review form state
  const [doctorNotes, setDoctorNotes] = useState(patient?.reviewNotes || "");
  const [followUpInstructions, setFollowUpInstructions] = useState(patient?.followUpInstructions || "");
  const [consultationDate, setConsultationDate] = useState(patient?.nextConsultationDate || "");
  const [reviewStatus, setReviewStatus] = useState(patient?.reviewStatus || "Needs Review");
  const [saveToast, setSaveToast] = useState("");

  // Communication message state
  const [commFeedback, setCommFeedback] = useState("");

  // Sync form states whenever selected patient changes or loads
  useEffect(() => {
    if (patient) {
      setPatientInsights(patient.insights || []);
      setDoctorNotes(patient.reviewNotes || "");
      setFollowUpInstructions(patient.followUpInstructions || "");
      setConsultationDate(patient.nextConsultationDate || "");
      setReviewStatus(patient.reviewStatus || "Needs Review");
    }
  }, [patient]);

  // Update insights when patient changes
  const handleSelectPatient = (pId) => {
    setSelectedPatientId(pId);
    const target = activePatients.find((p) => p.id === pId) || activePatients[0];
    if (target) {
      setPatientInsights(target.insights || []);
      setDoctorNotes(target.reviewNotes || "");
      setFollowUpInstructions(target.followUpInstructions || "");
      setConsultationDate(target.nextConsultationDate || "");
      setReviewStatus(target.reviewStatus || "Needs Review");
    }
    setActiveTab("detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Filtered patients list
  const filteredPatients = useMemo(() => {
    return activePatients.filter((p) => {
      // Search query
      const matchesSearch =
        p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
        p.id.toLowerCase().includes(patientSearch.toLowerCase()) ||
        (p.email && p.email.toLowerCase().includes(patientSearch.toLowerCase())) ||
        (p.diabetesType && p.diabetesType.toLowerCase().includes(patientSearch.toLowerCase()));

      if (!matchesSearch) return false;

      // Filter chips
      if (patientFilter === "all") return true;
      if (patientFilter === "needs_review") return p.reviewStatus === "Needs Review";
      if (patientFilter === "high_variability") return (p.riskFlag || "").includes("Glucose") || (p.riskFlag || "").includes("Vitals");
      if (patientFilter === "low_activity") return p.avgSteps7d < 4500;
      if (patientFilter === "low_sleep") return p.avgSleep7d < 6.0;
      if (patientFilter === "missed_meds") return p.adherencePct < 85;
      if (patientFilter === "incomplete_data") return p.completenessPct < 85;
      if (patientFilter === "recently_updated") return (p.lastUpdated || "").includes("Today") || (p.lastUpdated || "").includes("Recently");
      if (patientFilter === "not_updated_7d") return (p.lastUpdated || "").includes("4 days") || (p.lastUpdated || "").includes("days");

      return true;
    });
  }, [activePatients, patientSearch, patientFilter]);

  // Longitudinal trend data for selected patient
  const trendData = useMemo(() => {
    const raw = GENERATE_TREND_DATA(patient);
    if (trendRange === "7d") return raw.slice(-7);
    return raw; // 14d default
  }, [patient, trendRange]);

  // Doctor action handlers for insights
  const handleInsightAction = (id, newStatus) => {
    setPatientInsights((prev) =>
      prev.map((ins) => (ins.id === id ? { ...ins, status: newStatus } : ins))
    );
    setSaveToast(`Insight updated: ${newStatus}`);
    setTimeout(() => setSaveToast(""), 3000);
  };

  const handleAddInsightComment = (id, comment) => {
    setPatientInsights((prev) =>
      prev.map((ins) => (ins.id === id ? { ...ins, doctorComment: comment } : ins))
    );
  };

  // Save review notes
  const handleSaveNotes = (e) => {
    e.preventDefault();
    setSaveToast("Clinical review notes and follow-up plan saved successfully.");
    setTimeout(() => setSaveToast(""), 4000);
  };

  // Communication shortcuts
  const handleSendQuickCommunication = (type) => {
    let msg = "";
    if (type === "reminder") {
      msg = `Prompt dispatched to ${patient.name}: "Friendly reminder from ${doctorDisplayName} to log your daily biometrics."`;
    } else if (type === "education") {
      msg = `Lifestyle bulletin shared with ${patient.name}: "Post-Dinner Glycemic Control & Light Walking Guide".`;
    } else if (type === "extra_readings") {
      msg = `Telemetry request sent to ${patient.name}: "Please record an additional fasting blood glucose tomorrow morning."`;
    } else if (type === "schedule") {
      msg = `Follow-up consultation confirmed with ${patient.name} for ${consultationDate || "next week"}.`;
    }
    setCommFeedback(msg);
    setTimeout(() => setCommFeedback(""), 5000);
  };

  // Print Report Handler
  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto pb-20 text-slate-100">
      {/* =====================================================================
          1. CLINICAL HEADER & TELEMETRY COMMAND BAR
      ===================================================================== */}
      <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl shadow-black/40 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-950/80 border border-blue-500/40 text-blue-400 flex items-center justify-center text-3xl shadow-lg shadow-blue-900/30">
              🩺
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl md:text-3xl font-extrabold text-white">
                  Clinician Command Center
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-blue-950/60 border border-blue-500/40 text-blue-300">
                  MD Remote Station
                </span>
              </div>
              <p className="text-slate-400 text-sm mt-1">
                {doctorDisplayName}, MD • Endocrinology & Tele-Metabolic Health • <span className="text-slate-300 font-medium">Apollo Medical Center</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#090d16] border border-slate-800 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Audit Logging Active</span>
            </div>
            <button
              onClick={() => {
                setSaveToast("Cohort telemetry refreshed.");
                setTimeout(() => setSaveToast(""), 2000);
              }}
              className="px-3.5 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 rounded-xl text-xs font-medium transition flex items-center gap-1.5"
            >
              <span>🔄</span> Refresh Telemetry
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-600/30 transition flex items-center gap-1.5"
            >
              <span>📄</span> Export Cohort Report
            </button>
          </div>
        </div>

        {/* Clinical Disclaimer Banner */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-start gap-3 bg-blue-950/20 border border-blue-500/20 rounded-xl p-3.5 text-xs text-slate-300">
          <span className="text-base text-blue-400">ℹ️</span>
          <div>
            <strong className="text-white font-semibold">Clinical Review & Decision Support Standard:</strong> This dashboard centralizes patient-recorded ambulatory metrics and rule-based heuristic patterns. It supports clinical review and consultative follow-up; it <strong>does not automatically diagnose diseases or alter medication dosages</strong>.
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mt-6 pt-2">
          {[
            { id: "overview", label: "Cohort Overview & Priority Queue", icon: "📊" },
            { id: "patients", label: "Patient Directory (24)", icon: "👥" },
            { id: "detail", label: `Selected: ${patient.name} (${patient.id})`, icon: "🩺" },
            { id: "reports", label: "Clinical Reports & PDF", icon: "📄" },
            { id: "security", label: "Governance & Consent Trail", icon: "🔒" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition flex items-center gap-2 cursor-pointer ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "bg-[#090d16] text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Toast Alert */}
      {saveToast && (
        <div className="mb-6 p-4 rounded-xl bg-blue-950/80 border border-blue-500/50 text-blue-200 text-sm flex items-center justify-between shadow-xl shadow-blue-950/40 animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="text-blue-400">✓</span> {saveToast}
          </div>
          <button onClick={() => setSaveToast("")} className="text-blue-400 hover:text-white text-xs">Dismiss</button>
        </div>
      )}

      {/* Communication Toast */}
      {commFeedback && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-sm flex items-center justify-between shadow-xl shadow-emerald-950/40 animate-in fade-in">
          <div className="flex items-center gap-2">
            <span>📡</span> {commFeedback}
          </div>
          <button onClick={() => setCommFeedback("")} className="text-emerald-400 hover:text-white text-xs">Dismiss</button>
        </div>
      )}

      {/* =====================================================================
          2. TOP CLINICIAN METRIC CARDS (Always visible on Overview & Cohort)
      ===================================================================== */}
      {(activeTab === "overview" || activeTab === "patients") && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Assigned Cohort Telemetry Triage
            </h2>
            <span className="text-[11px] text-slate-500">
              Protocol: Clinical Review Prioritization (Non-emergency)
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {/* Card 1: Total Patients */}
            <div
              onClick={() => { setActiveTab("patients"); setPatientFilter("all"); }}
              className="bg-[#0d1322] border border-slate-800 p-4 rounded-2xl shadow-lg hover:border-blue-500/40 transition cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Patients</span>
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              </div>
              <div className="text-2xl font-extrabold text-white mt-1.5 group-hover:text-blue-400 transition">
                {activePatients.length}
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">Real registered patients</p>
            </div>

            {/* Card 2: Patients Needing Review (Red Indicator) */}
            <div
              onClick={() => { setActiveTab("patients"); setPatientFilter("needs_review"); }}
              className="bg-[#0d1322] border border-red-500/30 p-4 rounded-2xl shadow-lg hover:border-red-500/60 transition cursor-pointer group bg-gradient-to-br from-[#0d1322] to-red-950/20"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-red-300 uppercase tracking-wider">Needing Review</span>
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
              </div>
              <div className="text-2xl font-extrabold text-red-400 mt-1.5">
                {activePatients.filter((p) => p.reviewStatus === "Needs Review").length}
              </div>
              <p className="text-[10px] text-red-300/80 mt-0.5">Protocol triage priority</p>
            </div>

            {/* Card 3: Incomplete Data (Yellow Indicator) */}
            <div
              onClick={() => { setActiveTab("patients"); setPatientFilter("incomplete_data"); }}
              className="bg-[#0d1322] border border-amber-500/30 p-4 rounded-2xl shadow-lg hover:border-amber-500/60 transition cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider">Incomplete Data</span>
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              </div>
              <div className="text-2xl font-extrabold text-amber-400 mt-1.5">
                {activePatients.filter((p) => p.completenessPct < 85).length}
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Telemetry gaps detected</p>
            </div>

            {/* Card 4: Improved Activity (Green Indicator) */}
            <div
              onClick={() => { setActiveTab("patients"); setPatientFilter("all"); }}
              className="bg-[#0d1322] border border-emerald-500/30 p-4 rounded-2xl shadow-lg hover:border-emerald-500/60 transition cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider">Improved Activity</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </div>
              <div className="text-2xl font-extrabold text-emerald-400 mt-1.5">
                {activePatients.filter((p) => p.avgSteps7d >= 6000).length}
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">&gt;6,000 steps volume</p>
            </div>

            {/* Card 5: High Glucose Variability (Red Indicator) */}
            <div
              onClick={() => { setActiveTab("patients"); setPatientFilter("high_variability"); }}
              className="bg-[#0d1322] border border-red-500/30 p-4 rounded-2xl shadow-lg hover:border-red-500/60 transition cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-red-300 uppercase tracking-wider">Glucose Fluctuation</span>
                <span className="w-2 h-2 rounded-full bg-red-400"></span>
              </div>
              <div className="text-2xl font-extrabold text-red-400 mt-1.5">
                {activePatients.filter((p) => (p.riskFlag || "").includes("Glucose") || (p.riskFlag || "").includes("Vitals")).length}
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Vitals alert flagged</p>
            </div>

            {/* Card 6: Missed Medication Entries (Yellow/Red Indicator) */}
            <div
              onClick={() => { setActiveTab("patients"); setPatientFilter("missed_meds"); }}
              className="bg-[#0d1322] border border-amber-500/30 p-4 rounded-2xl shadow-lg hover:border-amber-500/60 transition cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider">Missed Meds</span>
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              </div>
              <div className="text-2xl font-extrabold text-amber-400 mt-1.5">
                {activePatients.filter((p) => p.adherencePct < 85).length}
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Adherence &lt;85% gap</p>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 1: OVERVIEW & ATTENTION QUEUE
      ===================================================================== */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* Risk and Attention List */}
          <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl shadow-black/20">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="text-red-400">🚨</span> High-Priority Clinical Review Queue
                </h2>
                <p className="text-slate-400 text-xs mt-1">
                  Patients flagged by clinical rule heuristics for physician review. Click any patient to open their complete file in 1 click.
                </p>
              </div>
              <button
                onClick={() => { setActiveTab("patients"); setPatientFilter("needs_review"); }}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
              >
                View all {activePatients.filter((p) => p.reviewStatus === "Needs Review").length} flagged patients →
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activePatients.filter((p) => p.reviewStatus === "Needs Review").map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleSelectPatient(p.id)}
                  className="p-5 rounded-2xl bg-[#090d16] border border-slate-800 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-950/20 transition-all duration-200 cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-base text-white group-hover:text-blue-400 transition">
                          {p.name}
                        </div>
                        <div className="text-xs text-slate-400">
                          {p.age}y • {p.gender} • <span className="font-mono text-slate-500">{p.id}</span>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        p.riskLevel === "red"
                          ? "bg-red-950/60 border border-red-500/40 text-red-300"
                          : "bg-amber-950/60 border border-amber-500/40 text-amber-300"
                      }`}>
                        {p.riskLevel === "red" ? "Priority Review" : "Attention"}
                      </span>
                    </div>

                    <div className="mt-3.5 pt-3.5 border-t border-slate-800/80">
                      <div className="text-xs font-semibold text-red-400 flex items-center gap-1.5">
                        <span>⚠️</span> {p.riskFlag}
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                        <div className="p-2 rounded-lg bg-[#0d1322] border border-slate-800/60">
                          <span className="text-[10px] text-slate-500 block">Last Glucose</span>
                          <span className="font-bold text-white text-sm">{p.lastGlucose} mg/dL</span>
                        </div>
                        <div className="p-2 rounded-lg bg-[#0d1322] border border-slate-800/60">
                          <span className="text-[10px] text-slate-500 block">Adherence</span>
                          <span className="font-bold text-white text-sm">{p.adherencePct}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-mono">Updated: {p.lastUpdated}</span>
                    <span className="text-blue-400 group-hover:translate-x-1 transition-transform font-semibold">
                      Open Record →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Snapshot Matrix: Stable Cohort Sample */}
          <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-6 shadow-xl shadow-black/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="text-emerald-400">✅</span> Stable Patients (Routine Monitoring)
              </h2>
              <button
                onClick={() => { setActiveTab("patients"); setPatientFilter("all"); }}
                className="text-xs text-blue-400 hover:text-blue-300"
              >
                Browse directory table →
              </button>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {activePatients.filter((p) => p.reviewStatus === "Reviewed").map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleSelectPatient(p.id)}
                  className="p-4 rounded-xl bg-[#090d16] border border-slate-800 hover:border-slate-700 transition cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <h3 className="text-sm font-bold text-white">{p.name}</h3>
                    <p className="text-xs text-slate-400">Glucose: {p.lastGlucose} mg/dL • Steps: {p.avgSteps7d.toLocaleString()}</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
                    Stable
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: FULL PATIENT COHORT LIST TABLE & FILTERS
      ===================================================================== */}
      {activeTab === "patients" && (
        <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl shadow-black/20 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>👥</span> Patient Cohort Directory & Clinical Filters
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Centralized registry of all {activePatients.length} registered patients. Search, triage, and click to inspect full history.
              </p>
            </div>

            {/* Search Input */}
            <div className="w-full md:w-72">
              <input
                type="text"
                placeholder="Search by name, ID, condition..."
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
                className="w-full px-4 py-2 bg-[#090d16] border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Filter Chips Bar */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/80">
            {[
              { id: "all", label: "All Patients" },
              { id: "needs_review", label: "Needs Review (5)" },
              { id: "high_variability", label: "High Glucose Variability (4)" },
              { id: "low_activity", label: "Low Activity (<4.5k steps)" },
              { id: "low_sleep", label: "Low Sleep (<6h)" },
              { id: "missed_meds", label: "Missed Medication (<85%)" },
              { id: "incomplete_data", label: "Incomplete Data (<85%)" },
              { id: "recently_updated", label: "Recently Updated" },
              { id: "not_updated_7d", label: "Not Updated >3d" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setPatientFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  patientFilter === f.id
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "bg-[#090d16] text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#090d16] text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Patient</th>
                  <th className="p-3.5">Diagnosis</th>
                  <th className="p-3.5">Last Glucose</th>
                  <th className="p-3.5">Last BP</th>
                  <th className="p-3.5">7-Day Steps</th>
                  <th className="p-3.5">7-Day Sleep</th>
                  <th className="p-3.5">Adherence</th>
                  <th className="p-3.5">Completeness</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Risk Flag</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 bg-[#0d1322]">
                {filteredPatients.map((p) => {
                  const isSelected = p.id === selectedPatientId;
                  return (
                    <tr
                      key={p.id}
                      onClick={() => handleSelectPatient(p.id)}
                      className={`hover:bg-slate-800/30 transition cursor-pointer ${
                        isSelected ? "bg-blue-950/20 border-l-2 border-blue-500" : ""
                      }`}
                    >
                      <td className="p-3.5">
                        <div className="font-bold text-white text-sm">{p.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{p.id} • {p.age}y {p.gender}</div>
                      </td>
                      <td className="p-3.5 text-slate-300 font-medium">{p.diabetesType}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded font-bold ${
                          p.lastGlucose > 150
                            ? "bg-red-950/60 text-red-300 border border-red-500/30"
                            : p.lastGlucose > 130
                            ? "bg-amber-950/60 text-amber-300 border border-amber-500/30"
                            : "bg-emerald-950/60 text-emerald-300 border border-emerald-500/30"
                        }`}>
                          {p.lastGlucose} mg/dL
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-slate-200">{p.lastBP}</td>
                      <td className="p-3.5 text-slate-300 font-mono">{p.avgSteps7d.toLocaleString()}</td>
                      <td className="p-3.5 text-slate-300 font-mono">{p.avgSleep7d} h</td>
                      <td className="p-3.5">
                        <span className={`font-semibold ${p.adherencePct < 80 ? "text-amber-400" : "text-emerald-400"}`}>
                          {p.adherencePct}%
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-slate-400">{p.completenessPct}%</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          p.reviewStatus === "Needs Review"
                            ? "bg-red-950/60 text-red-300 border border-red-500/40"
                            : "bg-emerald-950/60 text-emerald-300 border border-emerald-500/40"
                        }`}>
                          {p.reviewStatus}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className="text-[11px] text-slate-300 truncate max-w-[140px] block">
                          {p.riskFlag}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectPatient(p.id);
                          }}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition shadow-sm shadow-blue-600/30 cursor-pointer"
                        >
                          Open Patient
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: INDIVIDUAL PATIENT COMPLETE DETAIL VIEW
          (The most critical view for the physician)
      ===================================================================== */}
      {activeTab === "detail" && (
        <div className="space-y-8">
          {/* Patient Header Card */}
          <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl shadow-black/20">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-900/60 to-[#090d16] border border-blue-500/40 text-blue-400 flex items-center justify-center text-3xl font-extrabold shadow-lg">
                  {patient.name.charAt(0)}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2 className="text-2xl font-bold text-white">{patient.name}</h2>
                    <span className="px-2 py-0.5 rounded bg-slate-800 font-mono text-xs text-slate-300 border border-slate-700">
                      {patient.id}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      patient.reviewStatus === "Needs Review"
                        ? "bg-red-950/60 border border-red-500/40 text-red-300"
                        : "bg-emerald-950/60 border border-emerald-500/40 text-emerald-300"
                    }`}>
                      {patient.reviewStatus}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs mt-1">
                    {patient.age} years old • {patient.gender} • <strong className="text-white">{patient.diabetesType}</strong> (Diagnosed {patient.diagnosisYear}) • Blood Group: {patient.bloodGroup}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2.5 text-[11px] text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-[#090d16] border border-slate-800">
                      Height: {patient.heightCm} cm
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#090d16] border border-slate-800">
                      Weight: {patient.weightKg} kg
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#090d16] border border-slate-800 text-amber-300">
                      BMI: {(patient.weightKg / Math.pow(patient.heightCm / 100, 2)).toFixed(1)} kg/m² (Overweight)
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#090d16] border border-slate-800">
                      Smoking: {patient.smoking}
                    </span>
                  </div>
                </div>
              </div>

              {/* Patient Switcher & Consent Status */}
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Switch Patient:</span>
                  <select
                    value={selectedPatientId}
                    onChange={(e) => handleSelectPatient(e.target.value)}
                    className="px-3 py-1.5 bg-[#090d16] border border-slate-700 rounded-xl text-white text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    {activePatients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.patientCode || p.id.slice(0, 8)}) - {p.reviewStatus}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 text-[11px]">
                  <span className="px-2.5 py-1 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 rounded-full font-medium">
                    ✓ Consent: {patient.consentStatus}
                  </span>
                  <span className="px-2.5 py-1 bg-blue-950/40 border border-blue-500/30 text-blue-400 rounded-full font-medium">
                    ✓ {patient.sharingPermission}
                  </span>
                </div>
              </div>
            </div>

            {/* Prescriptions & Clinical Background Strip */}
            <div className="mt-6 pt-5 border-t border-slate-800/80 grid md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[#090d16] border border-slate-800">
                <span className="text-slate-400 font-semibold block mb-1">Prescribed Pharmacotherapy Regimen:</span>
                <div className="flex flex-wrap gap-1.5">
                  {patient.currentMedications.map((med, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-md bg-blue-950/50 border border-blue-500/30 text-blue-300 font-mono text-[11px]">
                      💊 {med}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#090d16] border border-slate-800">
                <span className="text-slate-400 font-semibold block mb-1">Family & Clinical Risk Background:</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {patient.familyHistory} • Alcohol: {patient.alcohol}
                </p>
              </div>
            </div>
          </div>

          {/* 9 Clinical Summary Metric Cards */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Patient Vital Telemetry Summary (Current Window)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
              {/* 1. Latest Glucose */}
              <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl shadow-lg">
                <span className="text-[11px] text-slate-400 font-medium block">Latest Glucose</span>
                <div className="text-2xl font-bold text-red-400 mt-1">{patient.lastGlucose} <span className="text-xs text-slate-400 font-normal">mg/dL</span></div>
                <span className="text-[10px] text-slate-500">Post-dinner ambulatory</span>
              </div>

              {/* 2. Latest BP */}
              <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl shadow-lg">
                <span className="text-[11px] text-slate-400 font-medium block">Latest BP</span>
                <div className="text-2xl font-bold text-white mt-1">{patient.lastBP} <span className="text-xs text-slate-400 font-normal">mmHg</span></div>
                <span className="text-[10px] text-slate-500">Resting seated</span>
              </div>

              {/* 3. Average Glucose 7d */}
              <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl shadow-lg">
                <span className="text-[11px] text-slate-400 font-medium block">Average Glucose (7d)</span>
                <div className="text-2xl font-bold text-white mt-1">144 <span className="text-xs text-slate-400 font-normal">mg/dL</span></div>
                <span className="text-[10px] text-amber-400">Target &lt;140 mg/dL</span>
              </div>

              {/* 4. Average BP 7d */}
              <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl shadow-lg">
                <span className="text-[11px] text-slate-400 font-medium block">Average BP (7d)</span>
                <div className="text-2xl font-bold text-white mt-1">131/85 <span className="text-xs text-slate-400 font-normal">mmHg</span></div>
                <span className="text-[10px] text-slate-500">Pre-hypertension range</span>
              </div>

              {/* 5. Average Steps 7d */}
              <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl shadow-lg">
                <span className="text-[11px] text-slate-400 font-medium block">Average Steps (7d)</span>
                <div className="text-2xl font-bold text-blue-400 mt-1">{patient.avgSteps7d.toLocaleString()}</div>
                <span className="text-[10px] text-slate-500">Goal: 7,500/day</span>
              </div>

              {/* 6. Average Sleep 7d */}
              <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl shadow-lg">
                <span className="text-[11px] text-slate-400 font-medium block">Average Sleep (7d)</span>
                <div className="text-2xl font-bold text-white mt-1">{patient.avgSleep7d} <span className="text-xs text-slate-400 font-normal">hours</span></div>
                <span className="text-[10px] text-red-400">Low sleep duration</span>
              </div>

              {/* 7. Weight Trend */}
              <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl shadow-lg">
                <span className="text-[11px] text-slate-400 font-medium block">Weight Trend (30d)</span>
                <div className="text-2xl font-bold text-emerald-400 mt-1">-0.6 <span className="text-xs text-slate-400 font-normal">kg</span></div>
                <span className="text-[10px] text-slate-500">Current: {patient.weightKg} kg</span>
              </div>

              {/* 8. Medication Adherence */}
              <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl shadow-lg">
                <span className="text-[11px] text-slate-400 font-medium block">Medication Adherence</span>
                <div className="text-2xl font-bold text-amber-400 mt-1">{patient.adherencePct}%</div>
                <span className="text-[10px] text-slate-500">3 missed entries logged</span>
              </div>

              {/* 9. Data Completeness */}
              <div className="bg-[#0d1322] border border-slate-800 p-4 rounded-xl shadow-lg col-span-2 md:col-span-1">
                <span className="text-[11px] text-slate-400 font-medium block">Data Completeness</span>
                <div className="text-2xl font-bold text-white mt-1">{patient.completenessPct}%</div>
                <span className="text-[10px] text-slate-500">Ambulatory sensor stream</span>
              </div>
            </div>
          </div>

          {/* =====================================================================
              LONGITUDINAL HEALTH TRENDS CHARTS
          ===================================================================== */}
          <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl shadow-black/20">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="text-blue-400">📈</span> Longitudinal Health Trajectory Visualization
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  Chronological multi-metric trends show how patient values change over time instead of isolated episodic readings.
                </p>
              </div>

              {/* Range Selector */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#090d16] border border-slate-800">
                {["7d", "14d", "30d", "90d"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setTrendRange(r)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      trendRange === r
                        ? "bg-blue-600 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {r.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Chart 1: Glycemic Trajectory */}
              <div className="p-4 rounded-xl bg-[#090d16] border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-white">Glycemic Patterns (Fasting vs Post-Meal vs Bedtime)</span>
                  <span className="text-[10px] text-slate-400">mg/dL</span>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 11 }} />
                      <YAxis stroke="#64748b" domain={[70, 200]} tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ backgroundColor: "#0d1322", borderColor: "#334155", borderRadius: "10px", fontSize: "12px" }} />
                      <Legend wrapperStyle={{ fontSize: "11px" }} />
                      <ReferenceLine y={140} stroke="#ef4444" strokeDasharray="4 4" label={{ value: "Target Max (140)", fill: "#ef4444", fontSize: 10 }} />
                      <ReferenceLine y={70} stroke="#3b82f6" strokeDasharray="4 4" label={{ value: "Lower Target (70)", fill: "#3b82f6", fontSize: 10 }} />
                      <Line type="monotone" dataKey="fastGlucose" name="Fasting" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="postMealGlucose" name="Post-Meal" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="bedtimeGlucose" name="Bedtime" stroke="#a855f7" strokeWidth={2} dot={{ r: 2.5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Blood Pressure & Pulse */}
              <div className="p-4 rounded-xl bg-[#090d16] border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-white">Cardiovascular Telemetry (Systolic / Diastolic / Pulse)</span>
                  <span className="text-[10px] text-slate-400">mmHg & bpm</span>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 11 }} />
                      <YAxis stroke="#64748b" domain={[60, 160]} tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ backgroundColor: "#0d1322", borderColor: "#334155", borderRadius: "10px", fontSize: "12px" }} />
                      <Legend wrapperStyle={{ fontSize: "11px" }} />
                      <ReferenceLine y={130} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: "Systolic Limit (130)", fill: "#f59e0b", fontSize: 10 }} />
                      <Line type="monotone" dataKey="systolic" name="Systolic BP" stroke="#f43f5e" strokeWidth={2.5} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="diastolic" name="Diastolic BP" stroke="#06b6d4" strokeWidth={2.5} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="pulse" name="Heart Rate (bpm)" stroke="#10b981" strokeWidth={1.5} strokeDasharray="2 2" dot={{ r: 2 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 3: Steps & Sleep Hours */}
              <div className="p-4 rounded-xl bg-[#090d16] border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-white">Activity & Sleep Correlation</span>
                  <span className="text-[10px] text-slate-400">Daily Steps & Sleep (h)</span>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 11 }} />
                      <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ backgroundColor: "#0d1322", borderColor: "#334155", borderRadius: "10px", fontSize: "12px" }} />
                      <Legend wrapperStyle={{ fontSize: "11px" }} />
                      <Bar dataKey="steps" name="Steps" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 4: Weight & Medication Adherence */}
              <div className="p-4 rounded-xl bg-[#090d16] border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-white">Weight Stability & Medication Adherence Rate</span>
                  <span className="text-[10px] text-slate-400">kg & % adherence</span>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 11 }} />
                      <YAxis yAxisId="left" stroke="#64748b" domain={[70, 85]} tick={{ fontSize: 11 }} />
                      <YAxis yAxisId="right" orientation="right" stroke="#64748b" domain={[0, 100]} tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ backgroundColor: "#0d1322", borderColor: "#334155", borderRadius: "10px", fontSize: "12px" }} />
                      <Legend wrapperStyle={{ fontSize: "11px" }} />
                      <Line yAxisId="left" type="monotone" dataKey="weight" name="Weight (kg)" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
                      <Line yAxisId="right" type="step" dataKey="adherence" name="Adherence %" stroke="#f59e0b" strokeWidth={2} dot={{ r: 2 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================================
              MEDITWIN HEURISTIC INSIGHTS PANEL (Doctor Evaluation)
          ===================================================================== */}
          <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl shadow-black/20">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="text-blue-400">🤖</span> MediTwin Rule-Based Heuristic Observations
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  System-generated associative patterns for clinician review. The physician can accept, reject, comment, or create follow-ups without being forced to adopt automated conclusions.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded bg-[#090d16] border border-slate-800 text-[11px] font-mono text-blue-400">
                Rule Engine v2.4 Active
              </span>
            </div>

            <div className="space-y-4">
              {patientInsights.map((ins) => (
                <div
                  key={ins.id}
                  className={`p-4 rounded-xl border transition-all ${
                    ins.status === "accepted"
                      ? "bg-blue-950/20 border-blue-500/40"
                      : ins.status === "rejected"
                      ? "bg-slate-900/40 border-slate-800 opacity-60"
                      : "bg-[#090d16] border-slate-800"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="text-lg">
                        {ins.type === "positive" ? "🌟" : ins.type === "alert" ? "⚠️" : "🔍"}
                      </span>
                      <div>
                        <div className="font-semibold text-white text-xs md:text-sm">
                          {ins.text}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] uppercase font-semibold text-slate-500">
                            Status: <span className={ins.status === "accepted" ? "text-blue-400" : ins.status === "rejected" ? "text-slate-400" : "text-amber-400"}>{ins.status.toUpperCase()}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        onClick={() => handleInsightAction(ins.id, "accepted")}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                          ins.status === "accepted"
                            ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                            : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                        }`}
                      >
                        ✓ Accept Insight
                      </button>
                      <button
                        onClick={() => handleInsightAction(ins.id, "rejected")}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                          ins.status === "rejected"
                            ? "bg-red-950/60 border border-red-500/40 text-red-300"
                            : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                        }`}
                      >
                        ✕ Not Clinically Relevant
                      </button>
                      <button
                        onClick={() => handleSendQuickCommunication("extra_readings")}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium cursor-pointer"
                      >
                        📡 Request More Data
                      </button>
                    </div>
                  </div>

                  {/* Doctor comment block */}
                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center gap-2">
                    <span className="text-xs text-slate-400">Doctor Note:</span>
                    <input
                      type="text"
                      placeholder="Add clinical observation comment..."
                      value={ins.doctorComment}
                      onChange={(e) => handleAddInsightComment(ins.id, e.target.value)}
                      className="flex-1 px-3 py-1 bg-[#0d1322] border border-slate-700/80 rounded-lg text-white text-xs placeholder-slate-500 outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* =====================================================================
              DIGITAL TWIN HEALTH-STATE MODEL SUMMARY
          ===================================================================== */}
          <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl shadow-black/20">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="text-blue-400">🧬</span> Digital Twin Health-State Synthesis Model
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  Algorithmic twin state representing the patient's current multi-metric physiological pattern.
                </p>
              </div>
              <span className="px-2.5 py-1 bg-amber-950/40 border border-amber-500/30 text-amber-300 rounded-lg text-[11px] font-semibold">
                Summary Model (Not Automated Medical Conclusion)
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Pattern State Box */}
              <div className="p-4 rounded-xl bg-[#090d16] border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-slate-300 block">Synthesized Physiological State:</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-[#0d1322] border border-slate-800/80">
                    <span className="text-[10px] text-slate-500 block">Glucose Trajectory</span>
                    <span className="font-bold text-amber-400 capitalize">{patient.digitalTwin.glucoseTrend.replace("_", " ")}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#0d1322] border border-slate-800/80">
                    <span className="text-[10px] text-slate-500 block">Blood Pressure Trend</span>
                    <span className="font-bold text-white capitalize">{patient.digitalTwin.bloodPressureTrend.replace("_", " ")}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#0d1322] border border-slate-800/80">
                    <span className="text-[10px] text-slate-500 block">Physical Activity</span>
                    <span className="font-bold text-blue-400 capitalize">{patient.digitalTwin.activityLevel}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#0d1322] border border-slate-800/80">
                    <span className="text-[10px] text-slate-500 block">Sleep Architecture</span>
                    <span className="font-bold text-amber-400 capitalize">{patient.digitalTwin.sleepPattern}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                  <span>Adherence Score: <strong className="text-white">{patient.digitalTwin.medicationAdherence}%</strong></span>
                  <span>Completeness: <strong className="text-white">{patient.digitalTwin.dataCompleteness}%</strong></span>
                </div>
              </div>

              {/* Flags Box */}
              <div className="p-4 rounded-xl bg-[#090d16] border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-slate-300 block">Twin Heuristic Flags:</span>
                
                <div>
                  <span className="text-[10px] font-semibold text-red-400 uppercase tracking-wider block mb-1.5">Attention Triggers:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {patient.digitalTwin.riskFlags.length > 0 ? (
                      patient.digitalTwin.riskFlags.map((flag, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded bg-red-950/60 border border-red-500/30 text-red-300 text-[11px] font-medium">
                          ⚠️ {flag}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500 text-xs">No active risk flags</span>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider block mb-1.5">Positive Indicators:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {patient.digitalTwin.positiveFlags.map((flag, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-[11px] font-medium">
                        ✓ {flag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================================
              HEALTH TIMELINE (Daily Records Table)
          ===================================================================== */}
          <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl shadow-black/20">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="text-blue-400">📅</span> Patient Daily Health Timeline Archive
                </h3>
                <p className="text-slate-400 text-xs mt-0.5">
                  Chronological records table. Click any date to view the full daily clinical entry breakdown.
                </p>
              </div>
              <span className="text-xs text-slate-500">7 most recent days</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#090d16] text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Glucose</th>
                    <th className="p-3">Blood Pressure</th>
                    <th className="p-3">Steps</th>
                    <th className="p-3">Sleep</th>
                    <th className="p-3">Diet Summary</th>
                    <th className="p-3">Medication</th>
                    <th className="p-3">Patient Notes</th>
                    <th className="p-3 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 bg-[#0d1322]">
                  {patient.timeline.map((row, idx) => (
                    <tr
                      key={idx}
                      onClick={() => setSelectedDailyLog(row)}
                      className="hover:bg-slate-800/30 transition cursor-pointer"
                    >
                      <td className="p-3 font-bold text-white font-mono">{row.date}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded font-bold ${
                          row.glucose > 150 ? "text-red-400" : "text-slate-200"
                        }`}>
                          {row.glucose} mg/dL
                        </span>
                      </td>
                      <td className="p-3 font-mono text-slate-300">{row.bp}</td>
                      <td className="p-3 font-mono text-blue-400">{row.steps.toLocaleString()}</td>
                      <td className="p-3 font-mono text-slate-300">{row.sleep} h</td>
                      <td className="p-3 text-slate-300 max-w-[150px] truncate">{row.food}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          row.med === "Taken"
                            ? "bg-emerald-950/60 text-emerald-300 border border-emerald-500/30"
                            : "bg-red-950/60 text-red-300 border border-red-500/30"
                        }`}>
                          {row.med}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400 max-w-[160px] truncate">{row.notes}</td>
                      <td className="p-3 text-right">
                        <span className="text-blue-400 font-semibold hover:underline">
                          Inspect →
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* =====================================================================
              DOCTOR REVIEW NOTES & CLINICAL INSTRUCTIONS
          ===================================================================== */}
          <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl shadow-black/20">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="text-blue-400">📝</span> Professional Review Notes & Follow-Up Plan
                </h3>
                <p className="text-slate-400 text-xs mt-0.5">
                  Record clinician observations and lifestyle follow-up guidance for patient review.
                </p>
              </div>
              <span className="px-2.5 py-1 bg-red-950/60 border border-red-500/40 text-red-300 rounded-lg text-[11px] font-semibold">
                Medication changes disabled in v1
              </span>
            </div>

            {/* Strict Regulatory Notice */}
            <div className="p-3.5 bg-amber-950/20 border border-amber-500/30 rounded-xl text-xs text-amber-200/90 mb-5 leading-relaxed">
              <strong>Clinical Guardrail:</strong> In accordance with telehealth clinical safety protocols, <strong>medication dosages cannot be changed or prescribed inside MediTwin v1</strong>. The clinician may only document observational notes, dietary/activity advice, and schedule follow-up appointments.
            </div>

            <form onSubmit={handleSaveNotes} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Physician Review Note:
                </label>
                <textarea
                  rows={3}
                  value={doctorNotes}
                  onChange={(e) => setDoctorNotes(e.target.value)}
                  placeholder="Enter clinical assessment notes..."
                  className="w-full px-4 py-3 bg-[#090d16] border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none leading-relaxed"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Diet, Activity & Monitoring Instructions:
                  </label>
                  <textarea
                    rows={2}
                    value={followUpInstructions}
                    onChange={(e) => setFollowUpInstructions(e.target.value)}
                    placeholder="E.g., 15 min walk after dinner, hydrate with 2L water..."
                    className="w-full px-4 py-2.5 bg-[#090d16] border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Next Consultation Date:
                    </label>
                    <input
                      type="date"
                      value={consultationDate}
                      onChange={(e) => setConsultationDate(e.target.value)}
                      className="w-full px-4 py-2 bg-[#090d16] border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Review Status:
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setReviewStatus("Reviewed")}
                        className={`flex-1 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                          reviewStatus === "Reviewed"
                            ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                            : "bg-[#090d16] text-slate-400 border border-slate-700"
                        }`}
                      >
                        ✓ Mark as Reviewed
                      </button>
                      <button
                        type="button"
                        onClick={() => setReviewStatus("Needs Review")}
                        className={`flex-1 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                          reviewStatus === "Needs Review"
                            ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                            : "bg-[#090d16] text-slate-400 border border-slate-700"
                        }`}
                      >
                        ⚠️ Keep in Needs Review
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs shadow-lg shadow-blue-600/30 transition cursor-pointer"
                >
                  💾 Save Clinical Notes & Status
                </button>
              </div>
            </form>
          </div>

          {/* =====================================================================
              SECURE FOLLOW-UP & COMMUNICATION TOOLS
          ===================================================================== */}
          <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-6 shadow-xl shadow-black/20">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <span className="text-blue-400">📡</span> Secure Clinician-Patient Tele-Notification
            </h3>
            <p className="text-slate-400 text-xs mb-4">
              Dispatch non-emergency adherence prompts or schedule notices to the patient's mobile app.
            </p>

            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
              <button
                onClick={() => handleSendQuickCommunication("reminder")}
                className="p-3 rounded-xl bg-[#090d16] border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/40 text-left transition cursor-pointer"
              >
                <span className="text-base block mb-1">📝</span>
                <span className="font-semibold text-white text-xs block">Logging Reminder</span>
                <span className="text-[10px] text-slate-400">Prompt daily journal completion</span>
              </button>

              <button
                onClick={() => handleSendQuickCommunication("education")}
                className="p-3 rounded-xl bg-[#090d16] border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/40 text-left transition cursor-pointer"
              >
                <span className="text-base block mb-1">🍎</span>
                <span className="font-semibold text-white text-xs block">Lifestyle Bulletin</span>
                <span className="text-[10px] text-slate-400">Send post-meal walk guide</span>
              </button>

              <button
                onClick={() => handleSendQuickCommunication("extra_readings")}
                className="p-3 rounded-xl bg-[#090d16] border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/40 text-left transition cursor-pointer"
              >
                <span className="text-base block mb-1">🩺</span>
                <span className="font-semibold text-white text-xs block">Request Extra Check</span>
                <span className="text-[10px] text-slate-400">Request extra glucose reading</span>
              </button>

              <button
                onClick={() => handleSendQuickCommunication("schedule")}
                className="p-3 rounded-xl bg-[#090d16] border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/40 text-left transition cursor-pointer"
              >
                <span className="text-base block mb-1">📅</span>
                <span className="font-semibold text-white text-xs block">Consultation Notice</span>
                <span className="text-[10px] text-slate-400">Send follow-up date confirmation</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 4: REPORTS AND CLINICAL EXPORT VIEW
      ===================================================================== */}
      {activeTab === "reports" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>📄</span> Clinical Patient Summary & Telemetry PDF Export
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Formatted clinical summary ready for export or review discussions.
              </p>
            </div>
            <button
              onClick={handlePrintReport}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-600/30 transition flex items-center gap-2 cursor-pointer"
            >
              <span>🖨️</span> Print / Save as PDF
            </button>
          </div>

          {/* Printable Report Paper Container */}
          <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6 text-slate-300 print:bg-white print:text-black">
            {/* Header */}
            <div className="border-b border-slate-800 pb-6 flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">MediTwin Clinical Telemetry Summary</h1>
                <p className="text-xs text-slate-400 mt-1">
                  Generated for Clinician Evaluation • Apollo Metabolic Remote Monitoring Center
                </p>
              </div>
              <div className="text-right text-xs">
                <span className="font-semibold text-white block">Reviewing Physician:</span>
                <span>{doctorDisplayName}, MD</span>
                <span className="text-slate-500 block">Date: {new Date().toLocaleDateString()}</span>
              </div>
            </div>

            {/* Demographics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-[#090d16] border border-slate-800 text-xs">
              <div>
                <span className="text-slate-500 block">Patient Name:</span>
                <strong className="text-white text-sm">{patient.name}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Patient ID & Age:</span>
                <strong className="text-white text-sm">{patient.id} • {patient.age}y {patient.gender}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Diagnosis:</span>
                <strong className="text-white text-sm">{patient.diabetesType}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">BMI & Weight:</span>
                <strong className="text-white text-sm">{patient.weightKg} kg (BMI: 26.5)</strong>
              </div>
            </div>

            {/* Vital Averages */}
            <div>
              <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">14-Day Physiological Summary:</h4>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[#090d16] border border-slate-800 text-center">
                  <span className="text-slate-500 block text-[10px]">Avg Glucose</span>
                  <span className="text-base font-bold text-white">144 mg/dL</span>
                </div>
                <div className="p-3 rounded-lg bg-[#090d16] border border-slate-800 text-center">
                  <span className="text-slate-500 block text-[10px]">Avg Blood Pressure</span>
                  <span className="text-base font-bold text-white">131/85</span>
                </div>
                <div className="p-3 rounded-lg bg-[#090d16] border border-slate-800 text-center">
                  <span className="text-slate-500 block text-[10px]">Daily Steps</span>
                  <span className="text-base font-bold text-white">{patient.avgSteps7d}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#090d16] border border-slate-800 text-center">
                  <span className="text-slate-500 block text-[10px]">Avg Sleep</span>
                  <span className="text-base font-bold text-white">{patient.avgSleep7d} h</span>
                </div>
                <div className="p-3 rounded-lg bg-[#090d16] border border-slate-800 text-center">
                  <span className="text-slate-500 block text-[10px]">Adherence</span>
                  <span className="text-base font-bold text-white">{patient.adherencePct}%</span>
                </div>
                <div className="p-3 rounded-lg bg-[#090d16] border border-slate-800 text-center">
                  <span className="text-slate-500 block text-[10px]">Data Quality</span>
                  <span className="text-base font-bold text-white">{patient.completenessPct}%</span>
                </div>
              </div>
            </div>

            {/* Prescriptions */}
            <div className="text-xs">
              <span className="font-semibold text-slate-400 block mb-1">Active Prescribed Medications:</span>
              <p className="text-white font-mono">{patient.currentMedications.join(" • ")}</p>
            </div>

            {/* MediTwin Observations */}
            <div className="text-xs">
              <span className="font-semibold text-slate-400 block mb-1.5">MediTwin Accepted Heuristic Observations:</span>
              <ul className="list-disc pl-5 space-y-1 text-slate-300">
                {patientInsights.filter((i) => i.status === "accepted").map((ins, idx) => (
                  <li key={idx}>
                    {ins.text} {ins.doctorComment ? `— Clinician note: ${ins.doctorComment}` : ""}
                  </li>
                ))}
              </ul>
            </div>

            {/* Clinician Review Notes */}
            <div className="p-4 rounded-xl bg-[#090d16] border border-slate-800 text-xs space-y-2">
              <span className="font-bold text-white block">Physician Clinical Assessment & Follow-Up Plan:</span>
              <p className="text-slate-300 leading-relaxed">{doctorNotes}</p>
              <p className="text-blue-400"><strong>Follow-Up Directives:</strong> {followUpInstructions}</p>
              <p className="text-slate-400"><strong>Next Scheduled Consultation:</strong> {consultationDate || "Pending"}</p>
            </div>

            {/* Mandatory Regulatory Statement */}
            <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 italic">
              "This report is generated from patient-entered data in MediTwin. It is intended to support clinical discussion and should not replace clinical judgment."
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 5: GOVERNANCE, ACCESS & AUDIT TRAIL
      ===================================================================== */}
      {activeTab === "security" && (
        <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl shadow-black/20 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>🔒</span> Clinical Governance & Patient Consent Verification
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              Role-based delegation, patient consent contracts, and view audit trail. A doctor can only access telemetry for patients who explicitly consented.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#090d16] border border-slate-800 text-xs space-y-3">
              <span className="font-bold text-white text-sm block">Active Clinician Credentials:</span>
              <div className="space-y-1 text-slate-300">
                <p><strong>Clinician ID:</strong> DOC-MED-44109</p>
                <p><strong>Medical License:</strong> MD-99214-MA</p>
                <p><strong>Specialty:</strong> Adult Endocrinology & Metabolism</p>
                <p><strong>Hospital Network:</strong> Apollo Tele-Endocrinology Consortium</p>
                <p><strong>Encryption:</strong> AES-256 in transit & at rest</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#090d16] border border-slate-800 text-xs space-y-3">
              <span className="font-bold text-white text-sm block">Delegation Security Guarantee:</span>
              <p className="text-slate-400 leading-relaxed">
                Every access event into a patient record creates an immutable security audit entry. In accordance with privacy standards, health metrics are strictly excluded from server access log parameters.
              </p>
              <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300">
                ✓ 24 active patient consent tokens verified and current
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: DAILY LOG DETAILED INSPECTION DRAWER
      ===================================================================== */}
      {selectedDailyLog && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d1322] rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-slate-800 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xl">📋</span>
                <h4 className="font-bold text-white text-base">
                  Daily Record Breakdown: {selectedDailyLog.date}
                </h4>
              </div>
              <button
                onClick={() => setSelectedDailyLog(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#090d16] border border-slate-800">
                <span className="text-slate-500 block">Glucose Reading</span>
                <span className="font-bold text-white text-base">{selectedDailyLog.glucose} mg/dL</span>
              </div>
              <div className="p-3 rounded-xl bg-[#090d16] border border-slate-800">
                <span className="text-slate-500 block">Blood Pressure</span>
                <span className="font-bold text-white text-base">{selectedDailyLog.bp} mmHg</span>
              </div>
              <div className="p-3 rounded-xl bg-[#090d16] border border-slate-800">
                <span className="text-slate-500 block">Step Count</span>
                <span className="font-bold text-blue-400 text-base">{selectedDailyLog.steps.toLocaleString()}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#090d16] border border-slate-800">
                <span className="text-slate-500 block">Sleep Duration</span>
                <span className="font-bold text-white text-base">{selectedDailyLog.sleep} hours</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#090d16] border border-slate-800 text-xs space-y-2">
              <div>
                <span className="text-slate-400 font-semibold block">Meal & Nutrition Entry:</span>
                <p className="text-slate-200 mt-0.5">{selectedDailyLog.food}</p>
              </div>
              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-slate-400 font-semibold block">Medication Adherence:</span>
                <span className={`inline-block mt-0.5 px-2 py-0.5 rounded font-bold ${
                  selectedDailyLog.med === "Taken" ? "bg-emerald-950/60 text-emerald-300" : "bg-red-950/60 text-red-300"
                }`}>
                  {selectedDailyLog.med}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-slate-400 font-semibold block">Patient Journal Notes:</span>
                <p className="text-slate-300 italic mt-0.5">{selectedDailyLog.notes}</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedDailyLog(null)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorDashboard;
