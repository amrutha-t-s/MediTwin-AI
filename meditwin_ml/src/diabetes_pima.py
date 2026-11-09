"""
Model 1: PIMA Diabetes Risk Screening Model
Educational screening based on clinical and biometric indicators.
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

MODEL_FILE = "pima_diabetes_risk_model.joblib"
METADATA_FILE = "pima_diabetes_risk_metadata.json"

FEATURES = [
    "pregnancies", "glucose", "blood_pressure", "skin_thickness",
    "insulin", "bmi", "diabetes_pedigree_function", "age"
]
ZERO_AS_NAN_COLS = ["glucose", "blood_pressure", "skin_thickness", "insulin", "bmi"]

def load_and_preprocess_data():
    csv_path = os.path.join(RAW_DATA_DIR, "pima_diabetes.csv")
    df = pd.read_csv(csv_path)
    df = clean_columns(df)

    # Replace impossible zero values with NaN
    for col in ZERO_AS_NAN_COLS:
        if col in df.columns:
            df[col] = df[col].replace(0, np.nan)

    X = df[FEATURES]
    y = df["outcome"]
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
    print("\n--- Training Model 1: Pima Diabetes Risk Screening ---")
    X, y = load_and_preprocess_data()

    # Target plot
    plot_target_distribution(
        y, "PIMA Diabetes Outcome Distribution (0=No Diabetes, 1=Diabetes)",
        os.path.join(FIGURES_DIR, "01_pima_target_distribution.png")
    )

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    candidates = {
        "RandomForest": RandomForestClassifier(
            n_estimators=300, max_depth=8, min_samples_split=4, random_state=42, n_jobs=-1
        ),
        "GradientBoosting": GradientBoostingClassifier(
            n_estimators=150, max_depth=3, learning_rate=0.05, random_state=42
        ),
        "LogisticRegression": LogisticRegression(max_iter=2000, random_state=42),
        "DecisionTree": DecisionTreeClassifier(max_depth=6, random_state=42)
    }
    if XGB_AVAILABLE:
        candidates["XGBoost"] = XGBClassifier(
            n_estimators=200, eval_metric="logloss", random_state=42
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

        # Save confusion matrix plot
        plot_confusion_matrix(
            metrics["confusion_matrix"],
            classes=["Lower Risk (0)", "Higher Risk (1)"],
            title=f"PIMA Confusion Matrix - {name}",
            save_path=os.path.join(FIGURES_DIR, f"01_pima_cm_{name.lower()}.png")
        )

    comparison_df = pd.DataFrame(summary_rows).sort_values("f1", ascending=False)
    save_metrics_reports(comparison_df, evaluations, "01_pima_diabetes")

    # Curves comparison
    plot_roc_pr_curves(
        fitted_models, X_test, y_test,
        os.path.join(FIGURES_DIR, "01_pima_roc_curves.png"),
        os.path.join(FIGURES_DIR, "01_pima_pr_curves.png")
    )

    # Select best model by F1
    best_name = comparison_df.iloc[0]["model"]
    best_pipe = fitted_models[best_name]
    print(f"Best PIMA model: {best_name} with F1 = {comparison_df.iloc[0]['f1']:.4f}")

    # Feature importances if available
    classifier_step = best_pipe.named_steps["classifier"]
    if hasattr(classifier_step, "feature_importances_"):
        importances = classifier_step.feature_importances_
        plot_feature_importance(
            FEATURES, importances,
            f"Feature Importances ({best_name})",
            os.path.join(FIGURES_DIR, "01_pima_feature_importance.png")
        )
    elif hasattr(classifier_step, "coef_"):
        importances = np.abs(classifier_step.coef_[0])
        plot_feature_importance(
            FEATURES, importances,
            f"Coefficient Magnitudes ({best_name})",
            os.path.join(FIGURES_DIR, "01_pima_feature_importance.png")
        )

    metadata = {
        "model_name": "pima_diabetes_risk_screening",
        "best_algorithm": best_name,
        "input_features": FEATURES,
        "zero_as_nan_columns": ZERO_AS_NAN_COLS,
        "metrics": evaluations[best_name],
        "disclaimer": "Educational screening estimate only. Not a diagnosis and not medical advice."
    }
    save_model_artifacts(best_pipe, MODEL_FILE, metadata, METADATA_FILE)

    generate_model_card(
        model_name="Pima Diabetes Risk Screening Model",
        purpose="Educational screening estimation of type 2 diabetes risk from clinical exam indicators.",
        dataset_name="Pima Indians Diabetes Database (National Institute of Diabetes and Digestive and Kidney Diseases)",
        target_description="Outcome: 0 = Lower educational screening risk, 1 = Higher educational screening risk",
        input_features=FEATURES,
        best_model_architecture=best_name,
        performance_summary=evaluations[best_name],
        limitations=[
            "Data gathered exclusively from female patients of Pima Indian heritage aged 21 and older.",
            "Substantial missing values in physiological variables like insulin and skin thickness.",
            "Does not reflect modern demographic or global multi-ethnic distributions.",
            "Screening tool only; cannot diagnose impaired glucose tolerance or diabetes mellitus."
        ],
        bias_discussion=(
            "The Pima dataset exhibits distinct geographic and genetic specificity. "
            "Extrapolating risk to broader multi-ethnic cohorts carries algorithmic bias."
        ),
        save_filename="01_diabetes_pima_card.md"
    )

    return best_pipe, metadata

def predict_pima_diabetes_risk(input_data: dict) -> dict:
    """
    API-ready prediction function for PIMA Diabetes Risk.
    """
    model_path = os.path.join(ARTIFACTS_DIR, MODEL_FILE)
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Artifact {MODEL_FILE} not found. Please train models first.")

    model = joblib.load(model_path)
    clean_input = {to_snake_case(k): v for k, v in input_data.items()}

    row = {}
    for f in FEATURES:
        val = clean_input.get(f)
        if val is None or val == "" or (f in ZERO_AS_NAN_COLS and val == 0):
            row[f] = np.nan
        else:
            try:
                row[f] = float(val)
            except (ValueError, TypeError):
                row[f] = np.nan

    df_row = pd.DataFrame([row])
    prob_pos = float(model.predict_proba(df_row)[0][1])

    # Contributing factors
    key_factors = []
    if not np.isnan(row.get("glucose", np.nan)) and row["glucose"] > 140:
        key_factors.append("elevated fasting/post-load glucose")
    if not np.isnan(row.get("bmi", np.nan)) and row["bmi"] > 27:
        key_factors.append("body mass index in overweight/obesity range")
    if not np.isnan(row.get("age", np.nan)) and row["age"] > 45:
        key_factors.append("age above 45 years")
    if not np.isnan(row.get("blood_pressure", np.nan)) and row["blood_pressure"] > 80:
        key_factors.append("elevated diastolic blood pressure")

    if not key_factors:
        key_factors = ["glucose", "bmi", "age"]

    result_text = "Higher educational screening risk" if prob_pos >= 0.5 else "Lower educational screening risk"

    return {
        "model": "diabetes_risk_screening_pima",
        "result": result_text,
        "probability": round(prob_pos, 4),
        "key_factors": key_factors,
        "uncertainty": "Model performance is limited by historical population bias and dataset size (n=768).",
        "disclaimer": "Educational screening estimate only. Not a diagnosis and not medical advice."
    }

if __name__ == "__main__":
    train_and_evaluate()
