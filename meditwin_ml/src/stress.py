"""
Model 6: Stress Pattern Classification Model
Educational stress level estimation based on sleep hygiene, activity, and vitals.
Categorized into 3 clinical tiers: Low Stress (1-4), Moderate Stress (5-6), High Stress (7-10).
"""
import os
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder, LabelEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier

try:
    from xgboost import XGBClassifier
    XGB_AVAILABLE = True
except ImportError:
    XGB_AVAILABLE = False

from .common import (
    RAW_DATA_DIR, ARTIFACTS_DIR, FIGURES_DIR,
    clean_columns, to_snake_case, evaluate_classifier, plot_target_distribution,
    plot_confusion_matrix, plot_feature_importance,
    save_model_artifacts, save_metrics_reports, generate_model_card,
    UNIVERSAL_DISCLAIMER
)

MODEL_FILE = "stress_level_model.joblib"
METADATA_FILE = "stress_level_metadata.json"

NUMERIC_FEATURES = [
    "age", "sleep_duration", "quality_of_sleep", "physical_activity_level",
    "heart_rate", "daily_steps", "sys_bp", "dia_bp"
]
CATEGORICAL_FEATURES = ["gender", "occupation", "bmi_category", "sleep_disorder"]
ALL_FEATURES = NUMERIC_FEATURES + CATEGORICAL_FEATURES

STRESS_TIERS = ["Low Stress", "Moderate Stress", "High Stress"]

def parse_bp(bp_series):
    sys_list, dia_list = [], []
    for val in bp_series:
        if isinstance(val, str) and "/" in val:
            parts = val.split("/")
            try:
                sys_list.append(float(parts[0]))
                dia_list.append(float(parts[1]))
                continue
            except ValueError:
                pass
        sys_list.append(np.nan)
        dia_list.append(np.nan)
    return sys_list, dia_list

def to_stress_tier(val):
    try:
        num = float(val)
    except (ValueError, TypeError):
        num = 5.0
    if num <= 4.0:
        return "Low Stress"
    elif num <= 6.0:
        return "Moderate Stress"
    else:
        return "High Stress"

def load_and_preprocess_data():
    csv_path = os.path.join(RAW_DATA_DIR, "sleep_health_lifestyle.csv")
    df = pd.read_csv(csv_path)
    df = clean_columns(df)

    # Parse Blood Pressure column into systolic and diastolic
    if "blood_pressure" in df.columns:
        sys_bp, dia_bp = parse_bp(df["blood_pressure"])
        df["sys_bp"] = sys_bp
        df["dia_bp"] = dia_bp

    if "person_id" in df.columns:
        df = df.drop(columns=["person_id"])

    # Clean Sleep Disorder missingness
    if "sleep_disorder" in df.columns:
        df["sleep_disorder"] = df["sleep_disorder"].fillna("None")

    target_col = "stress_level"
    y_raw = df[target_col].apply(to_stress_tier)

    # Encode with fixed, intuitive ordering
    le = LabelEncoder()
    le.fit(STRESS_TIERS)
    y = le.transform(y_raw)
    class_names = list(le.classes_)

    for c in NUMERIC_FEATURES:
        if c not in df.columns:
            df[c] = np.nan
    for c in CATEGORICAL_FEATURES:
        if c not in df.columns:
            df[c] = "unknown"

    X = df[ALL_FEATURES]
    return X, y, class_names

def build_pipeline(classifier):
    preprocessor = ColumnTransformer(
        transformers=[
            ("num", Pipeline([
                ("imputer", SimpleImputer(strategy="median")),
                ("scaler", StandardScaler()),
            ]), NUMERIC_FEATURES),
            ("cat", Pipeline([
                ("imputer", SimpleImputer(strategy="most_frequent")),
                ("encoder", OneHotEncoder(handle_unknown="ignore", sparse_output=False)),
            ]), CATEGORICAL_FEATURES)
        ]
    )
    return Pipeline([
        ("preprocessor", preprocessor),
        ("classifier", classifier)
    ])

def train_and_evaluate():
    print("\n--- Training Model 6: Stress Pattern Classification (3-Tier Clinical Grouping) ---")
    X, y, class_names = load_and_preprocess_data()

    plot_target_distribution(
        y, f"Stress Level Category Distribution ({len(class_names)} Clinical Tiers)",
        os.path.join(FIGURES_DIR, "06_stress_target_distribution.png")
    )

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    candidates = {
        "GradientBoosting": GradientBoostingClassifier(
            n_estimators=100, max_depth=3, learning_rate=0.05, random_state=42
        ),
        "RandomForest": RandomForestClassifier(n_estimators=300, max_depth=8, random_state=42, n_jobs=-1),
        "LogisticRegression": LogisticRegression(max_iter=2000, random_state=42),
        "DecisionTree": DecisionTreeClassifier(max_depth=6, random_state=42)
    }
    if XGB_AVAILABLE:
        candidates["XGBoost"] = XGBClassifier(
            n_estimators=200, max_depth=5, eval_metric="mlogloss", random_state=42, n_jobs=-1
        )

    fitted_models = {}
    evaluations = {}
    summary_rows = []

    for name, clf in candidates.items():
        pipe = build_pipeline(clf)
        pipe.fit(X_train, y_train)
        fitted_models[name] = pipe
        metrics = evaluate_classifier(pipe, X_test, y_test, is_multiclass=True)
        evaluations[name] = metrics
        summary_rows.append({
            "model": name,
            "accuracy": metrics["accuracy"],
            "macro_precision": metrics["precision"],
            "macro_recall": metrics["recall"],
            "macro_f1": metrics["f1"],
            "roc_auc": metrics["roc_auc"]
        })

        plot_confusion_matrix(
            metrics["confusion_matrix"],
            classes=class_names,
            title=f"Stress CM - {name}",
            save_path=os.path.join(FIGURES_DIR, f"06_stress_cm_{name.lower()}.png")
        )

    comparison_df = pd.DataFrame(summary_rows).sort_values("macro_f1", ascending=False)
    save_metrics_reports(comparison_df, evaluations, "06_stress_level")

    best_name = comparison_df.iloc[0]["model"]
    best_pipe = fitted_models[best_name]
    print(f"Best Stress model: {best_name} with Accuracy = {comparison_df.iloc[0]['accuracy']:.4f}, Macro-F1 = {comparison_df.iloc[0]['macro_f1']:.4f}")

    metadata = {
        "model_name": "stress_level_model",
        "best_algorithm": best_name,
        "input_features": ALL_FEATURES,
        "class_names": class_names,
        "metrics": evaluations[best_name],
        "disclaimer": "This is not a mental-health diagnosis or clinical assessment."
    }
    save_model_artifacts(best_pipe, MODEL_FILE, metadata, METADATA_FILE)

    generate_model_card(
        model_name="Stress Pattern Classification Model",
        purpose="Educational stress level pattern classification associating biometric vitals and sleep consistency.",
        dataset_name="Sleep Health and Lifestyle Dataset",
        target_description="Stress Level Tiers: Low Stress (1-4), Moderate Stress (5-6), High Stress (7-10)",
        input_features=ALL_FEATURES,
        best_model_architecture=best_name,
        performance_summary=evaluations[best_name],
        limitations=[
            "Observational correlation between sleep duration, activity, and self-scored stress.",
            "Lacks cortisol, heart-rate variability (HRV), or psychometric inventories (e.g. PSS-10).",
            "Job occupation categories represent cohort clusters.",
            "Strictly educational; cannot be used for psychiatric screening or acute stress disorders."
        ],
        bias_discussion=(
            "Subjective stress self-scoring varies widely across cultural backgrounds and individual coping mechanisms. "
            "Telemetry models reflect cohort trends rather than psychological diagnostics."
        ),
        save_filename="06_stress_level_card.md"
    )

    return best_pipe, metadata

def predict_stress_level(input_data: dict) -> dict:
    """
    API-ready prediction function for Stress Level.
    """
    model_path = os.path.join(ARTIFACTS_DIR, MODEL_FILE)
    meta_path = os.path.join(ARTIFACTS_DIR, METADATA_FILE)
    if not os.path.exists(model_path) or not os.path.exists(meta_path):
        raise FileNotFoundError(f"Artifact {MODEL_FILE} not found. Please train models first.")

    import json
    with open(meta_path, "r", encoding="utf-8") as f:
        metadata = json.load(f)
    class_names = metadata["class_names"]

    model = joblib.load(model_path)
    clean_input = {to_snake_case(k): v for k, v in input_data.items()}

    # BP string parsing if provided as '120/80'
    if "blood_pressure" in clean_input and "/" in str(clean_input["blood_pressure"]):
        parts = str(clean_input["blood_pressure"]).split("/")
        clean_input["sys_bp"] = parts[0]
        clean_input["dia_bp"] = parts[1]

    defaults = {
        "age": 35.0,
        "sleep_duration": 7.0,
        "quality_of_sleep": 7.0,
        "physical_activity_level": 60.0,
        "heart_rate": 72.0,
        "daily_steps": 6000.0,
        "sys_bp": 120.0,
        "dia_bp": 80.0,
        "gender": "Male",
        "occupation": "Engineer",
        "bmi_category": "Normal",
        "sleep_disorder": "None"
    }

    row = {}
    for f in ALL_FEATURES:
        val = clean_input.get(f)
        if val is None or val == "":
            row[f] = defaults.get(f)
        elif f in NUMERIC_FEATURES:
            try:
                row[f] = float(val)
            except (ValueError, TypeError):
                row[f] = defaults.get(f)
        else:
            row[f] = str(val)

    df_row = pd.DataFrame([row])
    probs = model.predict_proba(df_row)[0]
    pred_idx = int(np.argmax(probs))
    pred_tier = class_names[pred_idx]
    confidence = float(probs[pred_idx])

    approx_scores = {
        "Low Stress": 3,
        "Moderate Stress": 5,
        "High Stress": 8
    }
    approx_int = approx_scores.get(pred_tier, 5)

    key_factors = []
    if row["sleep_duration"] < 6.0:
        key_factors.append("daily sleep duration < 6 hours")
    if row["heart_rate"] >= 78:
        key_factors.append("resting heart rate >= 78 bpm")
    if row["daily_steps"] < 4000:
        key_factors.append("low daily ambulatory step count")
    if row["quality_of_sleep"] <= 5:
        key_factors.append("lower self-reported sleep quality score")

    if not key_factors:
        key_factors = ["sleep_duration", "heart_rate", "physical_activity_level"]

    return {
        "model": "stress_level_model",
        "result": f"Educational stress-pattern estimate: {pred_tier} Pattern",
        "stress_category": pred_tier,
        "estimated_stress_score": approx_int,
        "confidence": round(confidence, 4),
        "probability": round(confidence, 4),
        "key_factors": key_factors,
        "uncertainty": "Stress patterns reflect lifestyle heuristics, not psychological or neuroendocrine evaluations.",
        "disclaimer": "This is not a mental-health diagnosis or clinical assessment."
    }

if __name__ == "__main__":
    train_and_evaluate()
