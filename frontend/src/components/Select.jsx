function Select({ label, value, onChange, options = [], className = "", ...props }) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block mb-1.5 text-sm font-medium text-slate-300">{label}</label>
      )}

      <select
        value={value}
        onChange={onChange}
        className={`w-full px-3.5 py-2.5 bg-[#090d16] border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 transition-all ${className}`}
        {...props}
      >
        <option value="" className="bg-[#090d16] text-slate-400">Select</option>

        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-[#090d16] text-white">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Select;
