import { Home, FolderKanban, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const linkClass = (path) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
      location.pathname === path
        ? "bg-green-600 text-white"
        : "text-green-100 hover:bg-green-700"
    }`;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="w-64 h-screen bg-green-800 flex flex-col p-6 shadow-lg">
      <h1 className="text-2xl font-bold text-white mb-10">
        Renovation Pro
      </h1>

      <nav className="flex flex-col gap-4">
        <div
          className={linkClass("/dashboard")}
          onClick={() => navigate("/dashboard")}
        >
          <Home size={18} />
          Dashboard
        </div>
      </nav>

      <div className="mt-auto">
        <div
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-red-200 hover:bg-red-600 hover:text-white cursor-pointer transition"
        >
          <LogOut size={18} />
          Logout
        </div>
      </div>
    </div>
  );
}