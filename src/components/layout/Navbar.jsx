import { LogOut, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();

  const getRoleLabel = (roleValue) => {
    if (roleValue === "admin") return "Administrator";
    if (roleValue === "user") return "User";
    return "User";
  };

  const getInitial = (name) => {
    if (!name) return "U";

    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8 shadow-sm">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Dashboard</h2>
        <p className="text-sm text-slate-500">
          Kelola administrasi surat secara digital
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-bold text-slate-800">
            {user?.name || "User Takah"}
          </p>

          <p className="text-xs font-medium text-slate-500">
            {getRoleLabel(role)}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#002248] text-sm font-bold text-white">
          {user?.name ? getInitial(user.name) : <UserCircle size={24} />}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600 transition hover:bg-red-100"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}

export default Navbar;