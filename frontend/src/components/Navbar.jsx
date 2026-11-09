import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-[#090d16]/90 backdrop-blur-md border-b border-slate-800/80 px-6 lg:px-12 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-3 group">
        <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-blue-950/80 border border-blue-500/40 text-blue-400 shadow-md shadow-blue-900/30 group-hover:border-blue-400 transition">
          <span className="text-lg">🫀</span>
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
        </div>
        <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-blue-200 to-white bg-clip-text text-transparent">
          MediTwin
        </span>
      </Link>

      <div className="flex gap-5 items-center">
        <Link
          to="/about"
          className="text-slate-300 hover:text-blue-400 font-medium text-sm transition"
        >
          About
        </Link>

        <Link
          to="/login"
          className="text-slate-300 hover:text-white font-medium text-sm px-3 py-1.5 rounded-lg hover:bg-slate-800 transition"
        >
          Login
        </Link>

        <Link
          to="/register"
          className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-xl shadow-lg shadow-blue-600/25 transition active:scale-[0.98]"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
