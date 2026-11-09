function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <div className="p-3.5 mb-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 flex items-center gap-2.5 text-sm shadow-sm shadow-red-900/20">
      <span className="text-red-400 font-bold shrink-0">⚠️</span>
      <span>{message}</span>
    </div>
  );
}

export default ErrorMessage;
