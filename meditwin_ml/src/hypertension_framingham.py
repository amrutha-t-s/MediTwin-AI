"""
Model 3: Framingham Cardiovascular & Hypertension Risk Model
Educational 10-year cardiovascular risk screening based on historical cohort data.
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

MODEL_FILE = "framingham_cardio_risk_model.joblib"
METADATA_FILE = "framingham_cardio_risk_metadata.json"

FEATURES = [
    "male", "age", "education", "current_smoker", "cigs_per_day",
    "bp_meds", "prevalent_stroke", "prevalent_hyp", "diabetes",
    "tot_chol", "sys_bp", "dia_bp", "bmi", "heart_rate", "glucose"
]

def load_and_preprocess_data():
    csv_path = os.path.join(RAW_DATA_DIR, "framingham.csv")
    df = pd.read_csv(csv_path)
    df = clean_columns(df)

    # Standardize column naming variations
    col_mapping = {
        "currentsmoker": "current_smoker",
        "cigsperday": "cigs_per_day",
        "bpmeds": "bp_meds",
        "prevalentstroke": "prevalent_stroke",
        "prevalenthyp": "prevalent_hyp",
        "totchol": "tot_chol",
        "sysbp": "sys_bp",
        "diabp": "dia_bp",
        "heartrate": "heart_rate",
        "tenyearchd": "ten_year_chd"
    }
    df = df.rename(columns=col_mapping)

    for f in FEATURES:
        if f not in df.columns:
            df[f] = np.nan

    X = df[FEATURES]
    y = df["ten_year_chd"]
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
    print("\n--- Training Model 3: Framingham Cardiovascular Risk ---")
    X, y = load_and_preprocess_data()

    plot_target_distribution(
        y, "Framingham 10-Year CHD Outcome (0=No CHD, 1=10-Yr CHD Risk Screened)",
        os.path.join(FIGURES_DIR, "03_framingham_target_distribution.png")
    )

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    candidates = {
        "RandomForest": RandomForestClassifier(
            n_estimators=300, max_depth=8, min_samples_split=8, random_state=42, n_jobs=-1
        ),
        "GradientBoosting": GradientBoostingClassifier(
            n_estimators=150, max_depth=3, learning_rate=0.04, random_state=42
        ),
        "LogisticRegression": LogisticRegression(
            max_iter=2000, class_weight="balanced", C=0.5, random_state=42
        ),
        "DecisionTree": DecisionTreeClassifier(
            max_depth=6, class_weight="balanced", random_state=42
        )
    }
    if XGB_AVAILABLE:
        neg_count = (y_train == 0).sum()
        pos_count = (y_train == 1).sum()
        spw = neg_count / max(pos_count, 1)
        candidates["XGBoost"] = XGBClassifier(
            n_estimators=150, max_depth=3, scale_pos_weight=spw * 0.8,
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
            classes=["Negative (0)", "10Y CHD Risk (1)"],
            title=f"Framingham CM - {name}",
            save_path=os.path.join(FIGURES_DIR, f"03_framingham_cm_{name.lower()}.png")
        )

    comparison_df = pd.DataFrame(summary_rows)
    comparison_df["rank_score"] = 0.6 * comparison_df["accuracy"] + 0.4 * comparison_df["f1"]
    comparison_df = comparison_df.sort_values("rank_score", ascending=False).drop(columns=["rank_score"])
    save_metrics_reports(comparison_df, evaluations, "03_framingham_chd")

    plot_roc_pr_curves(
        fitted_models, X_test, y_test,
        os.path.join(FIGURES_DIR, "03_framingham_roc_curves.png"),
        os.path.join(FIGURES_DIR, "03_framingham_pr_curves.png")
    )

    best_name = comparison_df.iloc[0]["model"]
    best_pipe = fitted_models[best_name]
    print(f"Best Framingham model: {best_name} with F1 = {comparison_df.iloc[0]['f1']:.4f}")

    classifier_step = best_pipe.named_steps["classifier"]
    if hasattr(classifier_step, "feature_importances_"):
        importances = classifier_step.feature_importances_
        plot_feature_importance(
            FEATURES, importances,
            f"Framingham Feature Importances ({best_name})",
            os.path.join(FIGURES_DIR, "03_framingham_feature_importance.png")
        )

    metadata = {
        "model_name": "framingham_cardiovascular_risk",
        "best_algorithm": best_name,
        "input_features": FEATURES,
        "metrics": evaluations[best_name],
        "disclaimer": "This is not a diagnosis, not a clinical risk score, and not medical advice."
    }
    save_model_artifacts(best_pipe, MODEL_FILE, metadata, METADATA_FILE)

    generate_model_card(
        model_name="Framingham 10-Year Cardiovascular Risk Model",
        purpose="Educational cardiovascular-risk screening model based on historical Framingham epidemiological data.",
        dataset_name="Framingham Heart Study Cohort Dataset (National Heart, Lung, and Blood Institute)",
        target_description="TenYearCHD: 1 = Presence of 10-year coronary heart disease risk, 0 = Absence",
        input_features=FEATURES,
        best_model_architecture=best_name,
        performance_summary=evaluations[best_name],
        limitations=[
            "Historical mid-20th century cohort predominantly composed of white residents in Framingham, Massachusetts.",
            "Substantial population demographic changes and updated pharmacotherapies limit modern generalization.",
            "Missing lab records (glucose and total cholesterol) are imputed via median values.",
            "Educational prototype score; cannot replace validated clinical tools like ACC/AHA ASCVD Risk Estimator Plus."
        ],
        bias_discussion=(
            "The historical Framingham cohort exhibits severe racial, geographic, and generational homogeneity. "
            "It must not be utilized as an authoritative diagnostic risk assessment across diverse modern populations."
        ),
        save_filename="03_hypertension_framingham_card.md"
    )

    return best_pipe, metadata

def predict_framingham_cardio_risk(input_data: dict) -> dict:
    """
    API-ready prediction function for Framingham 10-year cardiovascular risk.
    """
    model_path = os.path.join(ARTIFACTS_DIR, MODEL_FILE)
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Artifact {MODEL_FILE} not found. Please train models first.")

    model = joblib.load(model_path)
    clean_input = {to_snake_case(k): v for k, v in input_data.items()}

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
    if not np.isnan(row.get("sys_bp", np.nan)) and row["sys_bp"] >= 140:
        key_factors.append("systolic blood pressure >= 140 mmHg")
    if not np.isnan(row.get("tot_chol", np.nan)) and row["tot_chol"] >= 240:
        key_factors.append("total cholesterol >= 240 mg/dL")
    if row.get("current_smoker", 0) == 1:
        key_factors.append("active cigarette smoking history")
    if not np.isnan(row.get("age", np.nan)) and row["age"] >= 55:
        key_factors.append("chronological age >= 55")
    if row.get("prevalent_hyp", 0) == 1 or row.get("bp_meds", 0) == 1:
        key_factors.append("history of hypertension or anti-hypertensive therapy")

    if not key_factors:
        key_factors = ["sys_bp", "tot_chol", "age"]

    result_text = "Educational cardiovascular-risk screening estimate: Elevated risk flagged" if prob_pos >= 0.5 else "Educational cardiovascular-risk screening estimate: Baseline risk observed"

    return {
        "model": "cardiovascular_risk_framingham",
        "result": result_text,
        "probability": round(prob_pos, 4),
        "key_factors": key_factors,
        "uncertainty": "Historical cohort parameters do not reflect contemporary therapeutic protocols or diverse racial demographics.",
        "disclaimer": "This is not a diagnosis, not a clinical risk score, and not medical advice."
    }

if __name__ == "__main__":
    train_and_evaluate()
