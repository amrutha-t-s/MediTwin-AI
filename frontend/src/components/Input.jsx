function Input({ label, type = "text", value, onChange, placeholder = "", className = "", ...props }) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block mb-1.5 text-sm font-medium text-slate-300">{label}</label>
      )}

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-3.5 py-2.5 bg-[#090d16] border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 transition-all ${className}`}
        {...props}
      />
    </div>
  );
}

export default Input;
