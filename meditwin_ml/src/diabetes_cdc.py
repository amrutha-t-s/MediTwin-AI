"""
Model 2: CDC Diabetes Health Indicators Risk Screening Model
Educational screening based on large-scale population lifestyle and health survey data.
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
from sklearn.ensemble import RandomForestClassifier

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

MODEL_FILE = "cdc_diabetes_risk_model.joblib"
METADATA_FILE = "cdc_diabetes_risk_metadata.json"

FEATURES = [
    "high_bp", "high_chol", "chol_check", "bmi", "smoker", "stroke",
    "heart_diseaseor_attack", "phys_activity", "fruits", "veggies",
    "hvy_alcohol_consump", "any_healthcare", "no_docbc_cost",
    "gen_hlth", "ment_hlth", "phys_hlth", "diff_walk", "sex",
    "age", "education", "income"
]

def load_and_preprocess_data():
    csv_path = os.path.join(RAW_DATA_DIR, "cdc_diabetes_health_indicators.csv")
    df = pd.read_csv(csv_path)
    df = clean_columns(df)

    # Standardize column naming variations
    col_mapping = {
        "diabetes_012": "diabetes_012",
        "highbp": "high_bp",
        "highchol": "high_chol",
        "cholcheck": "chol_check",
        "heartdiseaseorattack": "heart_diseaseor_attack",
        "physactivity": "phys_activity",
        "hvyalcoholconsump": "hvy_alcohol_consump",
        "anyhealthcare": "any_healthcare",
        "nodocbccost": "no_docbc_cost",
        "genhlth": "gen_hlth",
        "menthlth": "ment_hlth",
        "physhlth": "phys_hlth",
        "diffwalk": "diff_walk"
    }
    df = df.rename(columns=col_mapping)

    # Binary Target: 1 if prediabetes (1) or diabetes (2), else 0
    if "diabetes_012" in df.columns:
        df["diabetes_risk_positive"] = df["diabetes_012"].apply(lambda v: 1 if v in [1, 2, "1", "2"] else 0)
    elif "diabetes_binary" in df.columns:
        df["diabetes_risk_positive"] = df["diabetes_binary"].astype(int)

    # Ensure all required features exist
    for f in FEATURES:
        if f not in df.columns:
            df[f] = 0

    X = df[FEATURES]
    y = df["diabetes_risk_positive"]
    return X, y

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
    print("\n--- Training Model 2: CDC Diabetes Health Indicators ---")
    X, y = load_and_preprocess_data()

    # Target plot
    plot_target_distribution(
        y, "CDC Diabetes Risk Target (0=Non-diabetic, 1=Risk Flagged [Pre/Diabetic])",
        os.path.join(FIGURES_DIR, "02_cdc_target_distribution.png")
    )

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    candidates = {
        "RandomForest": RandomForestClassifier(
            n_estimators=200, max_depth=10, min_samples_split=8, class_weight="balanced", random_state=42, n_jobs=-1
        ),
        "LogisticRegression": LogisticRegression(
            max_iter=2000, class_weight="balanced", C=0.5, random_state=42
        ),
        "DecisionTree": DecisionTreeClassifier(
            max_depth=8, class_weight="balanced", random_state=42
        )
    }
    if XGB_AVAILABLE:
        # Balanced scale pos weight approximation
        neg_count = (y_train == 0).sum()
        pos_count = (y_train == 1).sum()
        spw = neg_count / max(pos_count, 1)
        candidates["XGBoost"] = XGBClassifier(
            n_estimators=100, max_depth=4, scale_pos_weight=spw / 2.0,
            eval_metric="logloss", random_state=42, n_jobs=-1
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
            classes=["Negative (0)", "Positive Risk (1)"],
            title=f"CDC Confusion Matrix - {name}",
            save_path=os.path.join(FIGURES_DIR, f"02_cdc_cm_{name.lower()}.png")
        )

    comparison_df = pd.DataFrame(summary_rows).sort_values("f1", ascending=False)
    save_metrics_reports(comparison_df, evaluations, "02_cdc_diabetes")

    plot_roc_pr_curves(
        fitted_models, X_test, y_test,
        os.path.join(FIGURES_DIR, "02_cdc_roc_curves.png"),
        os.path.join(FIGURES_DIR, "02_cdc_pr_curves.png")
    )

    best_name = comparison_df.iloc[0]["model"]
    best_pipe = fitted_models[best_name]
    print(f"Best CDC model: {best_name} with F1 = {comparison_df.iloc[0]['f1']:.4f}")

    classifier_step = best_pipe.named_steps["classifier"]
    if hasattr(classifier_step, "feature_importances_"):
        importances = classifier_step.feature_importances_
        plot_feature_importance(
            FEATURES, importances,
            f"CDC Feature Importances ({best_name})",
            os.path.join(FIGURES_DIR, "02_cdc_feature_importance.png")
        )

    metadata = {
        "model_name": "cdc_diabetes_risk_screening",
        "best_algorithm": best_name,
        "input_features": FEATURES,
        "metrics": evaluations[best_name],
        "disclaimer": "Educational diabetes-risk screening result only. Not a diagnosis and not medical advice."
    }
    save_model_artifacts(best_pipe, MODEL_FILE, metadata, METADATA_FILE)

    generate_model_card(
        model_name="CDC Diabetes Health Indicators Risk Screening Model",
        purpose="Educational risk screening synthesizing survey health indicators and behavioral factors.",
        dataset_name="CDC Behavioral Risk Factor Surveillance System (BRFSS) Health Indicators",
        target_description="diabetes_risk_positive (1 = Prediabetes or Diabetes history screened, 0 = Non-diabetic)",
        input_features=FEATURES,
        best_model_architecture=best_name,
        performance_summary=evaluations[best_name],
        limitations=[
            "Data derived from telephone survey self-reporting, susceptible to recall and social desirability bias.",
            "Substantial class imbalance typical of general epidemiological cohorts.",
            "Lacks confirmatory laboratory glycemic metrics (HbA1c or oral glucose tolerance tests).",
            "Screening estimate only; does not differentiate Type 1, Type 2, or secondary diabetes."
        ],
        bias_discussion=(
            "Self-reported health surveys frequently underrepresent marginalized or unhoused groups "
            "and individuals lacking consistent telephone access."
        ),
        save_filename="02_diabetes_cdc_card.md"
    )

    return best_pipe, metadata

def predict_cdc_diabetes_risk(input_data: dict) -> dict:
    """
    API-ready prediction function for CDC Diabetes Health Indicators.
    """
    model_path = os.path.join(ARTIFACTS_DIR, MODEL_FILE)
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Artifact {MODEL_FILE} not found. Please train models first.")

    model = joblib.load(model_path)
    clean_input = {to_snake_case(k): v for k, v in input_data.items()}

    # Defaults for typical population screening
    row = {}
    for f in FEATURES:
        val = clean_input.get(f)
        if val is None or val == "":
            row[f] = 0.0
        else:
            try:
                row[f] = float(val)
            except (ValueError, TypeError):
                row[f] = 0.0

    df_row = pd.DataFrame([row])
    prob_pos = float(model.predict_proba(df_row)[0][1])

    key_factors = []
    if row.get("high_bp", 0) == 1:
        key_factors.append("reported history of hypertension")
    if row.get("high_chol", 0) == 1:
        key_factors.append("reported elevated cholesterol")
    if row.get("bmi", 0) >= 30:
        key_factors.append("body mass index >= 30")
    if row.get("gen_hlth", 1) >= 4:
        key_factors.append("fair or poor general health rating")
    if row.get("phys_activity", 1) == 0:
        key_factors.append("sedentary physical activity pattern")

    if not key_factors:
        key_factors = ["high_bp", "high_chol", "bmi"]

    result_text = "Educational diabetes-risk screening result: Elevated pattern" if prob_pos >= 0.5 else "Educational diabetes-risk screening result: Baseline pattern"

    return {
        "model": "diabetes_risk_screening_cdc",
        "result": result_text,
        "probability": round(prob_pos, 4),
        "key_factors": key_factors,
        "uncertainty": "Survey-based screening metrics carry observational self-report uncertainty and population bias.",
        "disclaimer": "Educational diabetes-risk screening result only. Not a diagnosis and not medical advice."
    }

if __name__ == "__main__":
    train_and_evaluate()
