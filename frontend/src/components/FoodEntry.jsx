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
    <section className="rounded-xl border border-slate-800 bg-[#0d1322] p-6 shadow-sm">
      {/* Header */}
      <div className="mb-5 flex flex-col justify-between border-b border-slate-800/80 pb-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-white">
            Food Entry
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Log your daily meals, portions, timing, satisfaction, and dietary categories.
          </p>
        </div>
        <span className="mt-2 self-start rounded-full border border-blue-500/30 bg-blue-950/40 px-3 py-1 text-xs font-semibold text-blue-400 sm:mt-0 sm:self-center">
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
              className={`flex items-center justify-between rounded-lg border px-3.5 py-2.5 text-left text-sm font-medium transition cursor-pointer ${
                isSelected
                  ? "border-blue-500 bg-blue-950/50 text-blue-300 shadow-sm ring-2 ring-blue-500/30"
                  : "border-slate-800 bg-[#090d16] text-slate-300 hover:border-slate-700 hover:bg-slate-800/40"
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span>{meal.icon}</span>
                <span className="truncate">{meal.label}</span>
              </div>
              {hasContent && (
                <span
                  title="Recorded"
                  className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white"
                >
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Meal Section Card */}
      <div className="rounded-xl border border-slate-800 bg-[#090d16] p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{currentMeal.icon}</span>
            <h3 className="text-lg font-bold text-white">
              {currentMeal.label} Details
            </h3>
          </div>
          {formData[mealKey] && (
            <span className="text-xs text-blue-400 font-medium">
              ✓ Logged
            </span>
          )}
        </div>

        {/* Food Description */}
        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-slate-300">
            What did you eat? <span className="text-xs font-normal text-slate-500">(Text entry)</span>
          </label>
          <textarea
            name={mealKey}
            value={formData[mealKey] ?? ""}
            onChange={onChange}
            rows="3"
            placeholder={currentMeal.placeholder}
            className="w-full rounded-lg border border-slate-700 bg-[#070a12] px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Meal Time & Portion Description */}
        <div className="mb-5 grid gap-4 sm:grid-cols-2">
          {/* Meal Time */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">
              Meal Time
            </label>
            <input
              type="time"
              name={`${mealKey}Time`}
              value={formData[`${mealKey}Time`] ?? ""}
              onChange={onChange}
              className="w-full rounded-lg border border-slate-700 bg-[#070a12] px-4 py-2 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-slate-500">
              Time you consumed this meal.
            </p>
          </div>

          {/* Portion Description */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">
              Portion Description
            </label>
            <div className="space-y-1.5">
              <select
                name={`${mealKey}Portion`}
                value={formData[`${mealKey}Portion`] ?? ""}
                onChange={onChange}
                className="w-full rounded-lg border border-slate-700 bg-[#070a12] px-4 py-2 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="" className="bg-[#070a12] text-slate-400">Select portion size</option>
                {portionOptions.map((opt) => (
                  <option key={opt} value={opt} className="bg-[#070a12] text-white">
                    {opt}
                  </option>
                ))}
                <option value="Custom" className="bg-[#070a12] text-blue-400">Custom portion...</option>
              </select>

              {formData[`${mealKey}Portion`] === "Custom" && (
                <input
                  type="text"
                  name={`${mealKey}CustomPortion`}
                  value={formData[`${mealKey}CustomPortion`] ?? ""}
                  onChange={onChange}
                  placeholder="e.g. 1 medium bowl, 2 rotis"
                  className="w-full rounded-lg border border-slate-700 bg-[#070a12] px-3 py-1.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              )}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Serving or portion size estimate.
            </p>
          </div>
        </div>

        {/* Dietary Categories / Flags */}
        <div className="mb-5 rounded-lg border border-slate-800 bg-[#070a12] p-4">
          <label className="mb-1.5 block text-sm font-semibold text-slate-200">
            Dietary Categories
          </label>
          <p className="mb-3 text-xs text-slate-500">
            Tap to select all categories that applied to this meal:
          </p>

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {/* Sugary Drink */}
            <button
              type="button"
              onClick={() => handleToggleFlag(`${mealKey}SugaryDrink`)}
              className={`flex items-center gap-2 rounded-lg border p-2.5 text-xs font-medium transition cursor-pointer ${
                formData[`${mealKey}SugaryDrink`]
                  ? "border-amber-500/50 bg-amber-950/40 text-amber-300 ring-2 ring-amber-500/30"
                  : "border-slate-800 bg-[#0d1322] text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
              }`}
            >
              <span className="text-base">🥤</span>
              <span>Sugary drink</span>
              {formData[`${mealKey}SugaryDrink`] && (
                <span className="ml-auto text-amber-400 font-bold">✓</span>
              )}
            </button>

            {/* Fried Food */}
            <button
              type="button"
              onClick={() => handleToggleFlag(`${mealKey}FriedFood`)}
              className={`flex items-center gap-2 rounded-lg border p-2.5 text-xs font-medium transition cursor-pointer ${
                formData[`${mealKey}FriedFood`]
                  ? "border-red-500/50 bg-red-950/40 text-red-300 ring-2 ring-red-500/30"
                  : "border-slate-800 bg-[#0d1322] text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
              }`}
            >
              <span className="text-base">🍟</span>
              <span>Fried food</span>
              {formData[`${mealKey}FriedFood`] && (
                <span className="ml-auto text-red-400 font-bold">✓</span>
              )}
            </button>

            {/* High-carb meal */}
            <button
              type="button"
              onClick={() => handleToggleFlag(`${mealKey}HighCarb`)}
              className={`flex items-center gap-2 rounded-lg border p-2.5 text-xs font-medium transition cursor-pointer ${
                formData[`${mealKey}HighCarb`]
                  ? "border-amber-500/50 bg-amber-950/40 text-amber-300 ring-2 ring-amber-500/30"
                  : "border-slate-800 bg-[#0d1322] text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
              }`}
            >
              <span className="text-base">🍞</span>
              <span>High-carb</span>
              {formData[`${mealKey}HighCarb`] && (
                <span className="ml-auto text-amber-400 font-bold">✓</span>
              )}
            </button>

            {/* Vegetables included */}
            <button
              type="button"
              onClick={() => handleToggleFlag(`${mealKey}Vegetables`)}
              className={`flex items-center gap-2 rounded-lg border p-2.5 text-xs font-medium transition cursor-pointer ${
                formData[`${mealKey}Vegetables`]
                  ? "border-blue-500/50 bg-blue-950/40 text-blue-300 ring-2 ring-blue-500/30"
                  : "border-slate-800 bg-[#0d1322] text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
              }`}
            >
              <span className="text-base">🥗</span>
              <span>Vegetables</span>
              {formData[`${mealKey}Vegetables`] && (
                <span className="ml-auto text-blue-400 font-bold">✓</span>
              )}
            </button>
          </div>
        </div>

        {/* Meal Satisfaction */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-200">
            Meal Satisfaction (1–5)
          </label>
          <p className="mb-2.5 text-xs text-slate-500">
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
                  className={`flex flex-col items-center justify-center rounded-lg border p-2 text-center transition cursor-pointer ${
                    isSelected
                      ? "border-blue-500 bg-blue-950/50 text-blue-300 shadow-sm ring-2 ring-blue-500/30"
                      : "border-slate-800 bg-[#0d1322] text-slate-400 hover:border-slate-700 hover:bg-slate-800/40 hover:text-slate-200"
                  }`}
                >
                  <span className="text-lg">{lvl.emoji}</span>
                  <span className="mt-0.5 text-xs font-semibold">{lvl.value}</span>
                  <span className="hidden text-[10px] text-slate-400 sm:inline">
                    {lvl.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Day Overview Summary Pills */}
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-800/80 pt-3 text-xs text-slate-400">
        <span className="font-semibold text-slate-300">Meals Recorded:</span>
        {meals.map((m) => {
          const filled = Boolean(formData[m.key]);
          return (
            <span
              key={m.key}
              className={`rounded-full px-2.5 py-0.5 font-medium border ${
                filled
                  ? "bg-blue-950/50 border-blue-500/40 text-blue-300"
                  : "bg-slate-900 border-slate-800 text-slate-500"
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
