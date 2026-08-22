function Select({ label, value, onChange, options = [] }) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block mb-1 font-medium text-gray-700">{label}</label>
      )}

      <select
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border rounded-lg"
      >
        <option value="">Select</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Select;
