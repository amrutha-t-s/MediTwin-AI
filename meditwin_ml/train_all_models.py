"""
Master Training Runner for MediTwin Machine Learning Suite.
Trains all seven models sequentially and exports artifacts, metrics, figures, and model cards.
"""
import sys
import os

# Ensure UTF-8 stdout encoding on Windows
if sys.stdout.encoding != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Add package root to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from src.diabetes_pima import train_and_evaluate as train_pima
from src.diabetes_cdc import train_and_evaluate as train_cdc
from src.hypertension_framingham import train_and_evaluate as train_framingham
from src.cardiovascular import train_and_evaluate as train_cardio
from src.obesity import train_and_evaluate as train_obesity
from src.stress import train_and_evaluate as train_stress
from src.sleep_quality import train_and_evaluate as train_sleep

def main():
    print("=" * 60)
    print("   [MEDITWIN] MACHINE LEARNING PIPELINE TRAINING SUITE")
    print("=" * 60)

    try:
        train_pima()
        train_cdc()
        train_framingham()
        train_cardio()
        train_obesity()
        train_stress()
        train_sleep()
        print("\n" + "=" * 60)
        print("   [OK] ALL 7 MODELS TRAINED & EXPORTED SUCCESSFULLY!")
        print("=" * 60)
    except Exception as e:
        print(f"\n[ERROR] Pipeline training failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()
