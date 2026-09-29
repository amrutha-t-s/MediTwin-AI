import { useState } from "react";

function FoodEntry({ formData, onChange, setFormData }) {
  const [activeTab, setActiveTab] = useState("breakfast");

  const meals = [
    { key: "breakfast", label: "Breakfast", icon: "🥞", placeholder: "What did you eat for breakfast? (e.g. 2 eggs, avocado toast, tea)" },
    { key: "lunch", label: "Lunch", icon: "🥗", placeholder: "What did you eat for lunch? (e.g. Brown rice, grilled chicken, mixed salad)" },
    { key: "dinner", label: "Dinner", icon: "🍲", placeholder: "What did you eat for dinner? (e.g. Lentil soup, steamed vegetables, roti)" },
    { key: "snacks", label: "Snacks", icon: "🍎", placeholder: "Any snacks or beverages? (e.g. Apple, handful of walnuts, green tea)" },
  ];

  const portionOptions = [
    "Light / Small",
    "Moderate / Medium",
    "Generous / Large",
  ];

  const satisfactionLevels = [
    { value: 1, label: "1 - Low", emoji: "😫", desc: "Not satisfied" },
    { value: 2, label: "2 - Fair", emoji: "😐", desc: "Slightly satisfied" },
    { value: 3, label: "3 - Good", emoji: "🙂", desc: "Moderately satisfied" },
    { value: 4, label: "4 - High", emoji: "😊", desc: "Very satisfied" },
    { value: 5, label: "5 - Great", emoji: "🌟", desc: "Fully satisfied" },
  ];

  // Helper to toggle boolean flag in formData
  const handleToggleFlag = (flagName) => {
    const currentVal = !!formData[flagName];
    if (setFormData) {
      setFormData((prev) => ({
        ...prev,
        [flagName]: !currentVal,
      }));
    } else {
      onChange({ target: { name: flagName, value: !currentVal } });
    }
  };

  const currentMeal = meals.find((m) => m.key === activeTab) || meals[0];
  const mealKey = currentMeal.key;

  return (
    <section className="rounded-xl bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-5 flex flex-col justify-between border-b pb-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Food Entry
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Log your daily meals, portions, timing, satisfaction, and dietary categories.
          </p>
        </div>
        <span className="mt-2 self-start rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 sm:mt-0 sm:self-center">
          Nutrition & Meals
        </span>
      </div>

      {/* Meal Selection Tabs */}
      <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {meals.map((meal) => {
          const isSelected = activeTab === meal.key;
          const hasContent = Boolean(
            formData[meal.key] || formData[`${meal.key}Time`]
          );

          return (
            <button
              key={meal.key}
              type="button"
              onClick={() => setActiveTab(meal.key)}
              className={`flex items-center justify-between rounded-lg border px-3.5 py-2.5 text-left text-sm font-medium transition ${
                isSelected
                  ? "border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm ring-2 ring-emerald-200"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span>{meal.icon}</span>
                <span className="truncate">{meal.label}</span>
              </div>
              {hasContent && (
                <span
                  title="Recorded"
                  className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[10px] text-white"
                >
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Meal Section Card */}
      <div className="rounded-xl border border-gray-100 bg-slate-50/60 p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{currentMeal.icon}</span>
            <h3 className="text-lg font-semibold text-gray-900">
              {currentMeal.label} Details
            </h3>
          </div>
          {formData[mealKey] && (
            <span className="text-xs text-emerald-600 font-medium">
              ✓ Logged
            </span>
          )}
        </div>

        {/* Food Description */}
        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            What did you eat? <span className="text-xs font-normal text-gray-500">(Text entry)</span>
          </label>
          <textarea
            name={mealKey}
            value={formData[mealKey] ?? ""}
            onChange={onChange}
            rows="3"
            placeholder={currentMeal.placeholder}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          />
        </div>

        {/* Meal Time & Portion Description */}
        <div className="mb-5 grid gap-4 sm:grid-cols-2">
          {/* Meal Time */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Meal Time
            </label>
            <input
              type="time"
              name={`${mealKey}Time`}
              value={formData[`${mealKey}Time`] ?? ""}
              onChange={onChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            />
            <p className="mt-1 text-xs text-gray-500">
              Time you consumed this meal.
            </p>
          </div>

          {/* Portion Description */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Portion Description
            </label>
            <div className="space-y-1.5">
              <select
                name={`${mealKey}Portion`}
                value={formData[`${mealKey}Portion`] ?? ""}
                onChange={onChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
              >
                <option value="">Select portion size</option>
                {portionOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
                <option value="Custom">Custom portion...</option>
              </select>

              {formData[`${mealKey}Portion`] === "Custom" && (
                <input
                  type="text"
                  name={`${mealKey}CustomPortion`}
                  value={formData[`${mealKey}CustomPortion`] ?? ""}
                  onChange={onChange}
                  placeholder="e.g. 1 medium bowl, 2 rotis"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                />
              )}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Serving or portion size estimate.
            </p>
          </div>
        </div>

        {/* Dietary Categories / Flags */}
        <div className="mb-5 rounded-lg border border-gray-200 bg-white p-4">
          <label className="mb-1.5 block text-sm font-semibold text-gray-800">
            Dietary Categories
          </label>
          <p className="mb-3 text-xs text-gray-500">
            Tap to select all categories that applied to this meal:
          </p>

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {/* Sugary Drink */}
            <button
              type="button"
              onClick={() => handleToggleFlag(`${mealKey}SugaryDrink`)}
              className={`flex items-center gap-2 rounded-lg border p-2.5 text-xs font-medium transition ${
                formData[`${mealKey}SugaryDrink`]
                  ? "border-amber-500 bg-amber-50 text-amber-900 ring-2 ring-amber-200"
                  : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="text-base">🥤</span>
              <span>Sugary drink</span>
              {formData[`${mealKey}SugaryDrink`] && (
                <span className="ml-auto text-amber-700 font-bold">✓</span>
              )}
            </button>

            {/* Fried Food */}
            <button
              type="button"
              onClick={() => handleToggleFlag(`${mealKey}FriedFood`)}
              className={`flex items-center gap-2 rounded-lg border p-2.5 text-xs font-medium transition ${
                formData[`${mealKey}FriedFood`]
                  ? "border-orange-500 bg-orange-50 text-orange-900 ring-2 ring-orange-200"
                  : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="text-base">🍟</span>
              <span>Fried food</span>
              {formData[`${mealKey}FriedFood`] && (
                <span className="ml-auto text-orange-700 font-bold">✓</span>
              )}
            </button>

            {/* High-carb meal */}
            <button
              type="button"
              onClick={() => handleToggleFlag(`${mealKey}HighCarb`)}
              className={`flex items-center gap-2 rounded-lg border p-2.5 text-xs font-medium transition ${
                formData[`${mealKey}HighCarb`]
                  ? "border-yellow-600 bg-yellow-50 text-yellow-900 ring-2 ring-yellow-200"
                  : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="text-base">🍞</span>
              <span>High-carb</span>
              {formData[`${mealKey}HighCarb`] && (
                <span className="ml-auto text-yellow-700 font-bold">✓</span>
              )}
            </button>

            {/* Vegetables included */}
            <button
              type="button"
              onClick={() => handleToggleFlag(`${mealKey}Vegetables`)}
              className={`flex items-center gap-2 rounded-lg border p-2.5 text-xs font-medium transition ${
                formData[`${mealKey}Vegetables`]
                  ? "border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-200"
                  : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="text-base">🥗</span>
              <span>Vegetables</span>
              {formData[`${mealKey}Vegetables`] && (
                <span className="ml-auto text-emerald-700 font-bold">✓</span>
              )}
            </button>
          </div>
        </div>

        {/* Meal Satisfaction */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-800">
            Meal Satisfaction (1–5)
          </label>
          <p className="mb-2.5 text-xs text-gray-500">
            How satisfied and nourished did you feel after this meal?
          </p>

          <div className="grid grid-cols-5 gap-2">
            {satisfactionLevels.map((lvl) => {
              const isSelected =
                String(formData[`${mealKey}Satisfaction`]) ===
                String(lvl.value);

              return (
                <button
                  key={lvl.value}
                  type="button"
                  onClick={() =>
                    onChange({
                      target: {
                        name: `${mealKey}Satisfaction`,
                        value: lvl.value,
                      },
                    })
                  }
                  className={`flex flex-col items-center justify-center rounded-lg border p-2 text-center transition ${
                    isSelected
                      ? "border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm ring-2 ring-emerald-300"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-lg">{lvl.emoji}</span>
                  <span className="mt-0.5 text-xs font-semibold">{lvl.value}</span>
                  <span className="hidden text-[10px] text-gray-500 sm:inline">
                    {lvl.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Day Overview Summary Pills */}
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-3 text-xs text-gray-600">
        <span className="font-semibold text-gray-700">Meals Recorded:</span>
        {meals.map((m) => {
          const filled = Boolean(formData[m.key]);
          return (
            <span
              key={m.key}
              className={`rounded-full px-2.5 py-0.5 font-medium ${
                filled
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {m.label} {filled ? "✓" : "—"}
            </span>
          );
        })}
      </div>
    </section>
  );
}

export default FoodEntry;
