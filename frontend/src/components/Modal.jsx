function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0d1322] border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl text-slate-100">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white">{title}</h2>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            ✕
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

export default Modal;
