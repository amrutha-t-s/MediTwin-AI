"""
Common utility functions for MediTwin Machine Learning pipelines.
Includes data cleaning, evaluation, plotting, model card generation, and safety disclaimers.
"""
import os
import re
import json
import joblib
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")  # Headless rendering
import matplotlib.pyplot as plt
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, average_precision_score, confusion_matrix,
    classification_report, mean_absolute_error, mean_squared_error, r2_score,
    roc_curve, precision_recall_curve
)

# Project root resolution
SRC_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(SRC_DIR, ".."))
RAW_DATA_DIR = os.path.join(PROJECT_ROOT, "data", "raw")
PROCESSED_DATA_DIR = os.path.join(PROJECT_ROOT, "data", "processed")
ARTIFACTS_DIR = os.path.join(PROJECT_ROOT, "artifacts")
FIGURES_DIR = os.path.join(PROJECT_ROOT, "reports", "figures")
METRICS_DIR = os.path.join(PROJECT_ROOT, "reports", "metrics")
MODEL_CARDS_DIR = os.path.join(PROJECT_ROOT, "reports", "model_cards")

for d in [ARTIFACTS_DIR, FIGURES_DIR, METRICS_DIR, MODEL_CARDS_DIR, PROCESSED_DATA_DIR]:
    os.makedirs(d, exist_ok=True)

UNIVERSAL_DISCLAIMER = (
    "MediTwin is an educational wellness and lifestyle simulation prototype. "
    "It does not diagnose diseases, replace professional medical consultations, "
    "prescribe treatment, or recommend altering prescription medications. "
    "Always consult a licensed medical clinician for health concerns."
)

def to_snake_case(name: str) -> str:
    """Convert any string/column name into clean snake_case."""
    s = re.sub(r"[^\w\s]", "_", name)
    s = re.sub(r"([A-Z]+)([A-Z][a-z])", r"\1_\2", s)
    s = re.sub(r"([a-z\d])([A-Z])", r"\1_\2", s)
    s = re.sub(r"[\s\-]+", "_", s)
    s = re.sub(r"_+", "_", s)
    return s.strip("_").lower()

def clean_columns(df: pd.DataFrame) -> pd.DataFrame:
    """Clean all column names in a DataFrame to snake_case."""
    df = df.copy()
    df.columns = [to_snake_case(c) for c in df.columns]
    return df

def evaluate_classifier(model, X_test, y_test, is_multiclass: bool = False) -> dict:
    """
    Compute comprehensive classification metrics.
    """
    y_pred = model.predict(X_test)
    y_prob = None
    if hasattr(model, "predict_proba"):
        try:
            y_prob = model.predict_proba(X_test)
        except Exception:
            y_prob = None

    metrics = {
        "accuracy": float(accuracy_score(y_test, y_pred)),
        "precision": float(precision_score(y_test, y_pred, average="macro" if is_multiclass else "binary", zero_division=0)),
        "recall": float(recall_score(y_test, y_pred, average="macro" if is_multiclass else "binary", zero_division=0)),
        "f1": float(f1_score(y_test, y_pred, average="macro" if is_multiclass else "binary", zero_division=0)),
        "confusion_matrix": confusion_matrix(y_test, y_pred).tolist(),
        "classification_report": classification_report(y_test, y_pred, output_dict=True, zero_division=0)
    }

    if y_prob is not None:
        try:
            if is_multiclass:
                metrics["roc_auc"] = float(roc_auc_score(y_test, y_prob, multi_class="ovr", average="macro"))
                metrics["pr_auc"] = None
            else:
                prob_pos = y_prob[:, 1] if y_prob.shape[1] > 1 else y_prob[:, 0]
                metrics["roc_auc"] = float(roc_auc_score(y_test, prob_pos))
                metrics["pr_auc"] = float(average_precision_score(y_test, prob_pos))
        except Exception:
            metrics["roc_auc"] = None
            metrics["pr_auc"] = None
    else:
        metrics["roc_auc"] = None
        metrics["pr_auc"] = None

    return metrics

def evaluate_regressor(model, X_test, y_test) -> dict:
    """
    Compute comprehensive regression metrics.
    """
    y_pred = model.predict(X_test)
    mae = float(mean_absolute_error(y_test, y_pred))
    rmse = float(np.sqrt(mean_squared_error(y_test, y_pred)))
    r2 = float(r2_score(y_test, y_pred))
    return {
        "mae": mae,
        "rmse": rmse,
        "r2": r2,
        "y_pred_sample": [float(x) for x in y_pred[:10]],
    }

def plot_target_distribution(y, title: str, save_path: str):
    """Plot target distribution bar chart."""
    plt.figure(figsize=(7, 4.5))
    counts = pd.Series(y).value_counts().sort_index()
    counts.plot(kind="bar", color="#2563eb", edgecolor="#1e3a8a", alpha=0.85)
    plt.title(title, fontsize=12, fontweight="bold", pad=12)
    plt.xlabel("Category / Outcome")
    plt.ylabel("Count")
    plt.grid(axis="y", linestyle="--", alpha=0.4)
    plt.tight_layout()
    plt.savefig(save_path, dpi=200)
    plt.close()

def plot_confusion_matrix(cm, classes, title: str, save_path: str):
    """Plot and save confusion matrix heatmap."""
    plt.figure(figsize=(6, 5))
    cm_arr = np.array(cm)
    plt.imshow(cm_arr, interpolation="nearest", cmap="Blues")
    plt.title(title, fontsize=11, fontweight="bold")
    plt.colorbar()
    tick_marks = np.arange(len(classes))
    plt.xticks(tick_marks, classes, rotation=45, ha="right", fontsize=9)
    plt.yticks(tick_marks, classes, fontsize=9)

    thresh = cm_arr.max() / 2.0
    for i in range(cm_arr.shape[0]):
        for j in range(cm_arr.shape[1]):
            val = cm_arr[i, j]
            plt.text(
                j, i, format(val, "d"),
                horizontalalignment="center",
                color="white" if val > thresh else "black",
                fontweight="bold"
            )
    plt.ylabel("True Label")
    plt.xlabel("Predicted Label")
    plt.tight_layout()
    plt.savefig(save_path, dpi=200)
    plt.close()

def plot_roc_pr_curves(models_dict, X_test, y_test, roc_path: str, pr_path: str):
    """Plot ROC and PR comparison curves for binary classifiers."""
    # ROC
    plt.figure(figsize=(7, 5))
    for name, model in models_dict.items():
        if hasattr(model, "predict_proba"):
            try:
                y_prob = model.predict_proba(X_test)[:, 1]
                fpr, tpr, _ = roc_curve(y_test, y_prob)
                auc_val = roc_auc_score(y_test, y_prob)
                plt.plot(fpr, tpr, label=f"{name} (AUC = {auc_val:.3f})")
            except Exception:
                pass
    plt.plot([0, 1], [0, 1], "k--", alpha=0.6, label="Chance")
    plt.xlabel("False Positive Rate")
    plt.ylabel("True Positive Rate")
    plt.title("ROC Comparison Curve", fontweight="bold")
    plt.legend(loc="lower right", fontsize=9)
    plt.grid(True, linestyle="--", alpha=0.4)
    plt.tight_layout()
    plt.savefig(roc_path, dpi=200)
    plt.close()

    # PR
    plt.figure(figsize=(7, 5))
    for name, model in models_dict.items():
        if hasattr(model, "predict_proba"):
            try:
                y_prob = model.predict_proba(X_test)[:, 1]
                prec, rec, _ = precision_recall_curve(y_test, y_prob)
                ap_val = average_precision_score(y_test, y_prob)
                plt.plot(rec, prec, label=f"{name} (PR-AUC = {ap_val:.3f})")
            except Exception:
                pass
    plt.xlabel("Recall")
    plt.ylabel("Precision")
    plt.title("Precision-Recall Comparison Curve", fontweight="bold")
    plt.legend(loc="lower left", fontsize=9)
    plt.grid(True, linestyle="--", alpha=0.4)
    plt.tight_layout()
    plt.savefig(pr_path, dpi=200)
    plt.close()

def plot_feature_importance(feature_names, importances, title: str, save_path: str, top_n: int = 15):
    """Plot feature importance horizontal bar chart."""
    plt.figure(figsize=(8, 6))
    series = pd.Series(importances, index=feature_names).sort_values(ascending=True)
    if len(series) > top_n:
        series = series.tail(top_n)
    series.plot(kind="barh", color="#0284c7", edgecolor="#0369a1", alpha=0.85)
    plt.title(title, fontweight="bold", pad=12)
    plt.xlabel("Importance Score")
    plt.grid(axis="x", linestyle="--", alpha=0.4)
    plt.tight_layout()
    plt.savefig(save_path, dpi=200)
    plt.close()

def save_model_artifacts(model, model_filename: str, metadata: dict, metadata_filename: str):
    """Save trained model with joblib and metadata as JSON."""
    model_path = os.path.join(ARTIFACTS_DIR, model_filename)
    meta_path = os.path.join(ARTIFACTS_DIR, metadata_filename)
    joblib.dump(model, model_path)
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2, default=str)
    print(f"[OK] Saved model artifact -> {model_filename}")
    print(f"[OK] Saved model metadata -> {metadata_filename}")

def save_metrics_reports(comparison_df: pd.DataFrame, detailed_dict: dict, prefix: str):
    """Save comparison CSV and detailed JSON in reports/metrics/."""
    csv_path = os.path.join(METRICS_DIR, f"{prefix}_metrics_comparison.csv")
    json_path = os.path.join(METRICS_DIR, f"{prefix}_metrics_detail.json")
    comparison_df.to_csv(csv_path, index=False)
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(detailed_dict, f, indent=2, default=str)
    print(f"[OK] Metrics saved -> {prefix}_metrics_comparison.csv & detail.json")

def generate_model_card(
    model_name: str,
    purpose: str,
    dataset_name: str,
    target_description: str,
    input_features: list,
    best_model_architecture: str,
    performance_summary: dict,
    limitations: list,
    bias_discussion: str,
    save_filename: str
):
    """Generate Markdown Model Card compliant with ethical ML standards."""
    card = f"""# MediTwin Model Card: {model_name}

## 1. Model Overview
- **Model Identifier:** `{model_name}`
- **Purpose:** {purpose}
- **Architecture Selected:** `{best_model_architecture}`
- **Intended Users:** University researchers, students, and wellness telemetry simulators.
- **Out-of-Scope Use:** Emergency triage, disease diagnosis, insulin dosage prescription, or medication adjustment.

---

## 2. Dataset Information
- **Dataset Source:** {dataset_name}
- **Target Variable:** {target_description}
- **Number of Input Features:** {len(input_features)}
- **Features:** {', '.join(f'`{f}`' for f in input_features)}

---

## 3. Evaluation & Performance Metrics
Summary of test set evaluation (Stratified 80/20 split, `random_state=42`):

| Metric | Score |
| :--- | :--- |
"""
    for k, v in performance_summary.items():
        if isinstance(v, (int, float)):
            card += f"| **{k.upper()}** | `{v:.4f}` |\n"
        elif v is not None:
            card += f"| **{k.capitalize()}** | `{v}` |\n"

    card += f"""
---

## 4. Ethical Considerations, Bias & Limitations
### Known Limitations:
"""
    for lim in limitations:
        card += f"- {lim}\n"

    card += f"""
### Bias Discussion:
{bias_discussion}

### Uncertainty & Calibration:
All screening estimates represent statistical correlations over sampled observational populations. They do not represent causal certainty. A low risk score does not guarantee immunity from illness, nor does a high risk score confirm pathology.

---

## 5. Critical Clinical Safety Disclaimer
> **IMPORTANT:** {UNIVERSAL_DISCLAIMER}
"""

    card_path = os.path.join(MODEL_CARDS_DIR, save_filename)
    with open(card_path, "w", encoding="utf-8") as f:
        f.write(card)
    print(f"[OK] Model card generated -> {save_filename}")
