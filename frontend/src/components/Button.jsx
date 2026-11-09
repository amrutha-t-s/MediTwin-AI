function Button({ children, type = "button", onClick, className = "", variant = "primary" }) {
  let defaultStyle = "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25";
  
  if (variant === "danger") {
    defaultStyle = "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/25";
  } else if (variant === "secondary") {
    defaultStyle = "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700";
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${defaultStyle} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
