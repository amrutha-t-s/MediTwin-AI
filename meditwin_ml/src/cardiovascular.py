"""
Model 4: Cardiovascular Disease Risk Classification Model
Educational screening classifying cardiovascular pattern indicators.
"""
import os
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
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
    plot_confusion_matrix, plot_roc_pr_curves, plot_feature_importance,
    save_model_artifacts, save_metrics_reports, generate_model_card,
    UNIVERSAL_DISCLAIMER
)

MODEL_FILE = "cardiovascular_risk_model.joblib"
METADATA_FILE = "cardiovascular_risk_metadata.json"

FEATURES = [
    "age_years", "gender", "height", "weight", "ap_hi", "ap_lo",
    "cholesterol", "gluc", "smoke", "alco", "active", "bmi"
]

def load_and_preprocess_data():
    csv_path = os.path.join(RAW_DATA_DIR, "cardiovascular.csv")
    df = pd.read_csv(csv_path)
    df = clean_columns(df)

    if "id" in df.columns:
        df = df.drop(columns=["id"])

    # Age normalization: if age > 1000, convert from days to years
    if "age" in df.columns:
        if df["age"].mean() > 1000:
            df["age_years"] = (df["age"] / 365.25).round(1)
        else:
            df["age_years"] = df["age"]

    # BMI calculation
    if "bmi" not in df.columns and "weight" in df.columns and "height" in df.columns:
        df["bmi"] = (df["weight"] / ((df["height"] / 100.0) ** 2)).round(1)

    initial_count = len(df)
    # Biological plausibility validation
    valid_mask = (
        (df["height"] >= 100) & (df["height"] <= 230) &
        (df["weight"] >= 30) & (df["weight"] <= 200) &
        (df["ap_hi"] >= 70) & (df["ap_hi"] <= 240) &
        (df["ap_lo"] >= 40) & (df["ap_lo"] <= 150) &
        (df["ap_hi"] > df["ap_lo"])
    )
    df_clean = df[valid_mask].copy()
    removed_count = initial_count - len(df_clean)
    print(f"Data Cleaning: Removed {removed_count} biologically implausible rows ({initial_count} -> {len(df_clean)})")

    X = df_clean[FEATURES]
    y = df_clean["cardio"]
    return X, y, removed_count

def build_pipeline(classifier):
    preprocessor = ColumnTransformer(
        transformers=[
            ("num", Pipeline([
                ("imputer", SimpleImputer(strategy="median")),
                ("scaler", StandardScaler()),
            ]), FEATURES)
        ]
    )
    return Pipeline([
        ("preprocessor", preprocessor),
        ("classifier", classifier)
    ])

def train_and_evaluate():
    print("\n--- Training Model 4: Cardiovascular Disease Risk Classification ---")
    X, y, removed_rows = load_and_preprocess_data()

    plot_target_distribution(
        y, "Cardiovascular Disease Distribution (0=Absence, 1=Presence Screened)",
        os.path.join(FIGURES_DIR, "04_cardiovascular_target_distribution.png")
    )

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    candidates = {
        "LogisticRegression": LogisticRegression(max_iter=2000, random_state=42),
        "GradientBoosting": GradientBoostingClassifier(n_estimators=150, max_depth=3, learning_rate=0.05, random_state=42),
        "DecisionTree": DecisionTreeClassifier(max_depth=8, random_state=42),
        "RandomForest": RandomForestClassifier(n_estimators=200, max_depth=10, random_state=42, n_jobs=-1)
    }
    if XGB_AVAILABLE:
        candidates["XGBoost"] = XGBClassifier(
            n_estimators=200, max_depth=6, eval_metric="logloss", random_state=42, n_jobs=-1
        )

    fitted_models = {}
    evaluations = {}
    summary_rows = []

    for name, clf in candidates.items():
        pipe = build_pipeline(clf)
        pipe.fit(X_train, y_train)
        fitted_models[name] = pipe
        metrics = evaluate_classifier(pipe, X_test, y_test)
        evaluations[name] = metrics
        summary_rows.append({
            "model": name,
            "accuracy": metrics["accuracy"],
            "precision": metrics["precision"],
            "recall": metrics["recall"],
            "f1": metrics["f1"],
            "roc_auc": metrics["roc_auc"],
            "pr_auc": metrics["pr_auc"]
        })

        plot_confusion_matrix(
            metrics["confusion_matrix"],
            classes=["Absence (0)", "Presence (1)"],
            title=f"Cardio CM - {name}",
            save_path=os.path.join(FIGURES_DIR, f"04_cardio_cm_{name.lower()}.png")
        )

    comparison_df = pd.DataFrame(summary_rows).sort_values("f1", ascending=False)
    save_metrics_reports(comparison_df, evaluations, "04_cardiovascular")

    plot_roc_pr_curves(
        fitted_models, X_test, y_test,
        os.path.join(FIGURES_DIR, "04_cardio_roc_curves.png"),
        os.path.join(FIGURES_DIR, "04_cardio_pr_curves.png")
    )

    best_name = comparison_df.iloc[0]["model"]
    best_pipe = fitted_models[best_name]
    print(f"Best Cardio model: {best_name} with F1 = {comparison_df.iloc[0]['f1']:.4f}")

    classifier_step = best_pipe.named_steps["classifier"]
    if hasattr(classifier_step, "feature_importances_"):
        importances = classifier_step.feature_importances_
        plot_feature_importance(
            FEATURES, importances,
            f"Cardiovascular Feature Importances ({best_name})",
            os.path.join(FIGURES_DIR, "04_cardio_feature_importance.png")
        )

    metadata = {
        "model_name": "cardiovascular_disease_risk",
        "best_algorithm": best_name,
        "input_features": FEATURES,
        "removed_implausible_rows": removed_rows,
        "metrics": evaluations[best_name],
        "disclaimer": "Educational cardiovascular-risk screening estimate. Not a diagnosis and not medical advice."
    }
    save_model_artifacts(best_pipe, MODEL_FILE, metadata, METADATA_FILE)

    generate_model_card(
        model_name="Cardiovascular Disease Risk Classification Model",
        purpose="Educational risk screening synthesizing ambulatory biometrics (blood pressure, cholesterol, BMI).",
        dataset_name="Cardiovascular Disease Dataset (70,000 observational patient examination records)",
        target_description="cardio: 1 = Presence of cardiovascular condition screened, 0 = Absence",
        input_features=FEATURES,
        best_model_architecture=best_name,
        performance_summary=evaluations[best_name],
        limitations=[
            "Examination records represent cross-sectional clinic visits without longitudinal angiography verification.",
            "Features like smoking and alcohol consumption are recorded binarily without quantification of dosage/duration.",
            "Blood pressure readings require repeated ambulatory telemetry rather than single-snapshot evaluations.",
            "Educational prototype score; cannot be utilized in acute cardiac emergencies or chest pain evaluation."
        ],
        bias_discussion=(
            "Cross-sectional clinical examination data reflects patients actively presenting to healthcare facilities, "
            "potentially overestimating baseline risk relative to asymptomatic community cohorts."
        ),
        save_filename="04_cardiovascular_card.md"
    )

    return best_pipe, metadata

def predict_cardiovascular_risk(input_data: dict) -> dict:
    """
    API-ready prediction function for Cardiovascular Disease Risk.
    """
    model_path = os.path.join(ARTIFACTS_DIR, MODEL_FILE)
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Artifact {MODEL_FILE} not found. Please train models first.")

    model = joblib.load(model_path)
    clean_input = {to_snake_case(k): v for k, v in input_data.items()}

    # Compute BMI if missing
    weight = clean_input.get("weight")
    height = clean_input.get("height")
    bmi = clean_input.get("bmi")
    if (bmi is None or bmi == "") and weight and height:
        try:
            bmi = float(weight) / ((float(height) / 100.0) ** 2)
            clean_input["bmi"] = round(bmi, 1)
        except Exception:
            clean_input["bmi"] = np.nan

    # Age conversion
    age = clean_input.get("age_years") or clean_input.get("age")
    if age and float(age) > 1000:
        clean_input["age_years"] = float(age) / 365.25
    elif age:
        clean_input["age_years"] = float(age)

    row = {}
    for f in FEATURES:
        val = clean_input.get(f)
        if val is None or val == "":
            row[f] = np.nan
        else:
            try:
                row[f] = float(val)
            except (ValueError, TypeError):
                row[f] = np.nan

    df_row = pd.DataFrame([row])
    prob_pos = float(model.predict_proba(df_row)[0][1])

    key_factors = []
    if not np.isnan(row.get("ap_hi", np.nan)) and row["ap_hi"] >= 135:
        key_factors.append("elevated systolic blood pressure (>=135 mmHg)")
    if not np.isnan(row.get("cholesterol", np.nan)) and row["cholesterol"] > 1:
        key_factors.append("elevated serum cholesterol reading")
    if not np.isnan(row.get("bmi", np.nan)) and row["bmi"] >= 28:
        key_factors.append("elevated body mass index")
    if row.get("smoke", 0) == 1:
        key_factors.append("active tobacco smoking status")
    if row.get("active", 1) == 0:
        key_factors.append("low physical activity rating")

    if not key_factors:
        key_factors = ["ap_hi", "cholesterol", "bmi"]

    result_text = "Educational cardiovascular-risk screening estimate: Higher risk pattern" if prob_pos >= 0.5 else "Educational cardiovascular-risk screening estimate: Typical baseline pattern"

    return {
        "model": "cardiovascular_disease_risk",
        "result": result_text,
        "probability": round(prob_pos, 4),
        "key_factors": key_factors,
        "uncertainty": "Cross-sectional biometric snapshots do not replace comprehensive cardiology workups.",
        "disclaimer": "Educational cardiovascular-risk screening estimate. Not a diagnosis and not medical advice."
    }

if __name__ == "__main__":
    train_and_evaluate()
