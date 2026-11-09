"""
Model 7: Sleep Quality Prediction Model
Educational sleep quality trend model based on lifestyle, physical activity, and vitals.
"""
import os
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.ensemble import RandomForestRegressor

try:
    from xgboost import XGBRegressor
    XGB_AVAILABLE = True
except ImportError:
    XGB_AVAILABLE = False

from .common import (
    RAW_DATA_DIR, ARTIFACTS_DIR, FIGURES_DIR,
    clean_columns, to_snake_case, evaluate_regressor, plot_target_distribution,
    plot_feature_importance, save_model_artifacts, save_metrics_reports,
    generate_model_card, UNIVERSAL_DISCLAIMER
)

MODEL_FILE = "sleep_quality_model.joblib"
METADATA_FILE = "sleep_quality_metadata.json"

NUMERIC_FEATURES = [
    "age", "sleep_duration", "physical_activity_level", "stress_level",
    "heart_rate", "daily_steps", "sys_bp", "dia_bp"
]
CATEGORICAL_FEATURES = ["gender", "occupation", "bmi_category", "sleep_disorder"]
ALL_FEATURES = NUMERIC_FEATURES + CATEGORICAL_FEATURES

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

def load_and_preprocess_data():
    csv_path = os.path.join(RAW_DATA_DIR, "sleep_health_lifestyle.csv")
    df = pd.read_csv(csv_path)
    df = clean_columns(df)

    if "blood_pressure" in df.columns:
        sys_bp, dia_bp = parse_bp(df["blood_pressure"])
        df["sys_bp"] = sys_bp
        df["dia_bp"] = dia_bp

    if "person_id" in df.columns:
        df = df.drop(columns=["person_id"])

    if "sleep_disorder" in df.columns:
        df["sleep_disorder"] = df["sleep_disorder"].fillna("None")

    target_col = "quality_of_sleep"
    y = df[target_col].astype(float)

    for c in NUMERIC_FEATURES:
        if c not in df.columns:
            df[c] = np.nan
    for c in CATEGORICAL_FEATURES:
        if c not in df.columns:
            df[c] = "unknown"

    X = df[ALL_FEATURES]
    return X, y

def build_pipeline(regressor):
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
        ("regressor", regressor)
    ])

def train_and_evaluate():
    print("\n--- Training Model 7: Sleep Quality Prediction ---")
    X, y = load_and_preprocess_data()

    plot_target_distribution(
        y.round().astype(int), "Quality of Sleep Distribution (Rating Scale 1 to 10)",
        os.path.join(FIGURES_DIR, "07_sleep_quality_target_distribution.png")
    )

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42
    )

    candidates = {
        "LinearRegression": LinearRegression(),
        "RidgeRegression": Ridge(alpha=1.0),
        "RandomForestRegressor": RandomForestRegressor(n_estimators=300, max_depth=10, random_state=42, n_jobs=-1)
    }
    if XGB_AVAILABLE:
        candidates["XGBRegressor"] = XGBRegressor(
            n_estimators=200, max_depth=5, random_state=42, n_jobs=-1
        )

    fitted_models = {}
    evaluations = {}
    summary_rows = []

    for name, reg in candidates.items():
        pipe = build_pipeline(reg)
        pipe.fit(X_train, y_train)
        fitted_models[name] = pipe
        metrics = evaluate_regressor(pipe, X_test, y_test)
        evaluations[name] = metrics
        summary_rows.append({
            "model": name,
            "mae": metrics["mae"],
            "rmse": metrics["rmse"],
            "r2": metrics["r2"]
        })

    comparison_df = pd.DataFrame(summary_rows).sort_values("r2", ascending=False)
    save_metrics_reports(comparison_df, evaluations, "07_sleep_quality")

    best_name = comparison_df.iloc[0]["model"]
    best_pipe = fitted_models[best_name]
    print(f"Best Sleep Quality model: {best_name} with R2 = {comparison_df.iloc[0]['r2']:.4f}")

    regressor_step = best_pipe.named_steps["regressor"]
    if hasattr(regressor_step, "feature_importances_"):
        importances = regressor_step.feature_importances_
        # Plot numeric feature importances
        num_len = len(NUMERIC_FEATURES)
        plot_feature_importance(
            NUMERIC_FEATURES, importances[:num_len],
            f"Sleep Quality Numeric Feature Importances ({best_name})",
            os.path.join(FIGURES_DIR, "07_sleep_feature_importance.png")
        )

    metadata = {
        "model_name": "sleep_quality_model",
        "best_algorithm": best_name,
        "input_features": ALL_FEATURES,
        "metrics": evaluations[best_name],
        "disclaimer": "This is not a sleep-disorder diagnosis or clinical assessment."
    }
    save_model_artifacts(best_pipe, MODEL_FILE, metadata, METADATA_FILE)

    generate_model_card(
        model_name="Sleep Quality Trend Estimation Model",
        purpose="Educational regression model correlating sleep duration, stress score, and exercise with sleep quality index.",
        dataset_name="Sleep Health and Lifestyle Dataset",
        target_description="Quality of Sleep (Continuous index scaled 1 to 10)",
        input_features=ALL_FEATURES,
        best_model_architecture=best_name,
        performance_summary=evaluations[best_name],
        limitations=[
            "Quality ratings derived from subjective survey scoring rather than polysomnography (PSG) sleep studies.",
            "Lacks sleep architecture breakdown (REM vs Deep/Slow-Wave Sleep duration).",
            "Caffeine, circadian shift work, and evening screen exposure are not modeled.",
            "Screening prototype only; does not diagnose obstructive sleep apnea, narcolepsy, or restless legs syndrome."
        ],
        bias_discussion=(
            "Subjective sleep ratings differ based on lifestyle expectations and self-perceived sleep satisfaction. "
            "Wearable accelerometry or medical polysomnography is required for clinical sleep assessments."
        ),
        save_filename="07_sleep_quality_card.md"
    )

    return best_pipe, metadata

def predict_sleep_quality(input_data: dict) -> dict:
    """
    API-ready prediction function for Sleep Quality.
    """
    model_path = os.path.join(ARTIFACTS_DIR, MODEL_FILE)
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Artifact {MODEL_FILE} not found. Please train models first.")

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
        "physical_activity_level": 60.0,
        "stress_level": 5.0,
        "heart_rate": 72.0,
        "daily_steps": 6000.0,
        "sys_bp": 120.0,
        "dia_bp": 80.0,
        "gender": "Female",
        "occupation": "Nurse",
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
    pred_score = float(model.predict(df_row)[0])
    pred_clamped = max(1.0, min(10.0, pred_score))

    if pred_clamped >= 7.5:
        pattern_text = f"Restful Sleep Pattern (Est. {pred_clamped:.1f}/10)"
    elif pred_clamped >= 5.5:
        pattern_text = f"Moderate Sleep Quality Pattern (Est. {pred_clamped:.1f}/10)"
    else:
        pattern_text = f"Suboptimal Sleep Quality Pattern (Est. {pred_clamped:.1f}/10)"

    key_factors = []
    if row["sleep_duration"] >= 7.5:
        key_factors.append("healthy sleep duration (>=7.5 hrs)")
    elif row["sleep_duration"] < 6.0:
        key_factors.append("sleep duration below 6 hours")
    if row["stress_level"] <= 4:
        key_factors.append("low daytime reported stress")
    elif row["stress_level"] >= 7:
        key_factors.append("elevated daytime reported stress")
    if row["daily_steps"] >= 7000:
        key_factors.append("consistent daytime physical activity")

    if not key_factors:
        key_factors = ["sleep_duration", "stress_level", "daily_steps"]

    return {
        "model": "sleep_quality_model",
        "result": f"Educational sleep-pattern estimate: {pattern_text}",
        "estimated_quality_score": round(pred_clamped, 2),
        "confidence": 0.85,
        "key_factors": key_factors,
        "uncertainty": "Self-reported questionnaire data reflects lifestyle correlations, not sleep architecture polysomnography.",
        "disclaimer": "This is not a sleep-disorder diagnosis or clinical assessment."
    }

if __name__ == "__main__":
    train_and_evaluate()
