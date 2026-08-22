import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-white border-b px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        MediTwin
      </Link>

      <div className="flex gap-4 items-center">
        <Link
          to="/about"
          className="text-slate-600 hover:text-blue-600 font-medium"
        >
          About
        </Link>

        <Link to="/login" className="text-blue-600">
          Login
        </Link>

        <Link
          to="/register"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
