function Card({ title, children, className = "" }) {
  return (
    <div className={`bg-[#0d1322] border border-slate-800/80 rounded-2xl shadow-xl shadow-black/40 p-5 text-slate-100 ${className}`}>
      {title && (
        <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2 border-b border-slate-800 pb-2">
          {title}
        </h2>
      )}

      {children}
    </div>
  );
}

export default Card;
