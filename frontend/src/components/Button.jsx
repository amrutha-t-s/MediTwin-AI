function Button({ children, type = "button", onClick, className = "" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium transition ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
