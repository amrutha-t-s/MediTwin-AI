"""
Model 5: Obesity & Body Mass Category Estimation Model
Educational lifestyle and body composition pattern estimation model.
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
from sklearn.ensemble import RandomForestClassifier

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

MODEL_FILE = "obesity_risk_model.joblib"
METADATA_FILE = "obesity_risk_metadata.json"

NUMERIC_FEATURES = ["age", "height", "weight", "fcvc", "ncp", "ch2o", "faf", "tue"]
CATEGORICAL_FEATURES = [
    "gender", "family_history_with_overweight", "favc",
    "caec", "smoke", "scc", "calc", "mtrans"
]
ALL_FEATURES = NUMERIC_FEATURES + CATEGORICAL_FEATURES

TARGET_MAP = {
    "Insufficient_Weight": "Weight Lower Than Baseline",
    "Normal_Weight": "Healthy Weight Baseline Range",
    "Overweight_Level_I": "Mild Weight Elevation Pattern (Tier 1)",
    "Overweight_Level_II": "Moderate Weight Elevation Pattern (Tier 2)",
    "Obesity_Type_I": "Elevated Body Composition Tier 1",
    "Obesity_Type_II": "Elevated Body Composition Tier 2",
    "Obesity_Type_III": "Elevated Body Composition Tier 3"
}

def load_and_preprocess_data():
    csv_path = os.path.join(RAW_DATA_DIR, "obesity_levels.csv")
    df = pd.read_csv(csv_path)
    df = clean_columns(df)
    df = df.rename(columns={"ch2_o": "ch2o", "ch_2_o": "ch2o"})

    # Identify target column name
    target_col = [c for c in df.columns if "obeyes" in c or "obesity" in c or "target" in c][0]
    y_raw = df[target_col]

    le = LabelEncoder()
    y = le.fit_transform(y_raw)
    class_names = list(le.classes_)

    # Ensure all features exist
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
    print("\n--- Training Model 5: Obesity & Body Mass Category Estimation ---")
    X, y, class_names = load_and_preprocess_data()

    plot_target_distribution(
        y, f"Obesity Category Distribution ({len(class_names)} Classes)",
        os.path.join(FIGURES_DIR, "05_obesity_target_distribution.png")
    )

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    candidates = {
        "LogisticRegression": LogisticRegression(max_iter=2000, random_state=42),
        "DecisionTree": DecisionTreeClassifier(max_depth=12, random_state=42),
        "RandomForest": RandomForestClassifier(n_estimators=300, max_depth=14, random_state=42, n_jobs=-1)
    }
    if XGB_AVAILABLE:
        candidates["XGBoost"] = XGBClassifier(
            n_estimators=200, max_depth=6, eval_metric="mlogloss", random_state=42, n_jobs=-1
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
            classes=[c.replace("_", " ") for c in class_names],
            title=f"Obesity CM - {name}",
            save_path=os.path.join(FIGURES_DIR, f"05_obesity_cm_{name.lower()}.png")
        )

    comparison_df = pd.DataFrame(summary_rows).sort_values("macro_f1", ascending=False)
    save_metrics_reports(comparison_df, evaluations, "05_obesity")

    best_name = comparison_df.iloc[0]["model"]
    best_pipe = fitted_models[best_name]
    print(f"Best Obesity model: {best_name} with Macro-F1 = {comparison_df.iloc[0]['macro_f1']:.4f}")

    metadata = {
        "model_name": "obesity_risk_model",
        "best_algorithm": best_name,
        "input_features": ALL_FEATURES,
        "class_names": class_names,
        "metrics": evaluations[best_name],
        "disclaimer": "Educational lifestyle-pattern estimate. Does not constitute a clinical nutritional diagnosis."
    }
    save_model_artifacts(best_pipe, MODEL_FILE, metadata, METADATA_FILE)

    generate_model_card(
        model_name="Obesity & Body Mass Category Estimation Model",
        purpose="Educational lifestyle-pattern estimate based on nutritional habits, hydration, and physical exertion.",
        dataset_name="UCI Estimation of Obesity Levels Based on Eating Habits and Physical Condition (Mexico, Peru, Colombia)",
        target_description=f"NObeyesdad ({len(class_names)} multiclass body mass categories)",
        input_features=ALL_FEATURES,
        best_model_architecture=best_name,
        performance_summary=evaluations[best_name],
        limitations=[
            "Data primarily surveyed from young adults in urban Latin America, limiting cultural culinary generalization.",
            "Weight and height alone do not distinguish muscular hypertrophy from visceral adiposity.",
            "Uses supportive, non-stigmatizing observational classifications for education only.",
            "Clinical evaluation by a registered dietitian or endocrinologist remains essential."
        ],
        bias_discussion=(
            "Body mass index heuristics can misclassify muscular athletic demographics as elevated tiers "
            "and understate metabolic health risks in elderly populations with sarcopenia."
        ),
        save_filename="05_obesity_card.md"
    )

    return best_pipe, metadata

def predict_obesity_risk(input_data: dict) -> dict:
    """
    API-ready prediction function for Obesity Level Classification.
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

    # Defaults
    defaults = {
        "gender": "Female",
        "age": 28.0,
        "height": 1.70,
        "weight": 70.0,
        "family_history_with_overweight": "no",
        "favc": "no",
        "fcvc": 2.0,
        "ncp": 3.0,
        "caec": "Sometimes",
        "smoke": "no",
        "ch2o": 2.0,
        "scc": "no",
        "faf": 1.0,
        "tue": 1.0,
        "calc": "Sometimes",
        "mtrans": "Public_Transportation"
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

    # Height scale safeguard: if height in cm (>3), convert to meters
    if row["height"] > 3.0:
        row["height"] = row["height"] / 100.0

    df_row = pd.DataFrame([row])
    probs = model.predict_proba(df_row)[0]
    pred_idx = int(np.argmax(probs))
    pred_class = class_names[pred_idx]
    confidence = float(probs[pred_idx])

    friendly_label = TARGET_MAP.get(pred_class, pred_class.replace("_", " "))

    key_factors = []
    bmi = row["weight"] / (row["height"] ** 2)
    key_factors.append(f"estimated BMI {bmi:.1f} kg/m²")
    if row.get("faf", 0) < 1.0:
        key_factors.append("infrequent structured physical exercise")
    if row.get("ch2o", 2.0) < 1.5:
        key_factors.append("daily water intake < 1.5 liters")
    if row.get("favc") == "yes":
        key_factors.append("frequent high-caloric food intake reported")

    return {
        "model": "obesity_risk_model",
        "result": f"Educational lifestyle-pattern estimate: {friendly_label}",
        "raw_category": pred_class,
        "probability": round(confidence, 4),
        "key_factors": key_factors,
        "uncertainty": "Body composition calculations omit direct adiposity/lean muscle biological bioimpedance measurements.",
        "disclaimer": "Educational lifestyle-pattern estimate. Does not constitute a clinical nutritional diagnosis."
    }

if __name__ == "__main__":
    train_and_evaluate()
