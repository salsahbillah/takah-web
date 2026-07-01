import { useEffect, useRef, useState } from "react";
import {
  Clock,
  LogOut,
  ShieldCheck,
  UserCircle,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const getRoleLabel = (roleValue) => {
    if (roleValue === "admin") return "Administrator";
    if (roleValue === "user") return "User";
    return "User";
  };

  const getInitial = (name) => {
    if (!name) return "AT";

    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const toggleProfilePopup = () => {
    setIsProfileOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
            {user?.name || "Admin Takah"}
          </p>

          <p className="text-xs font-medium text-slate-500">
            {getRoleLabel(role)}
          </p>

          <div className="mt-1 flex items-center justify-end gap-1 text-xs font-medium text-emerald-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Online
          </div>
        </div>

        <div ref={profileRef} className="relative">
          <button
            type="button"
            onClick={toggleProfilePopup}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#002248] text-sm font-bold text-white ring-2 ring-transparent transition hover:scale-105 hover:ring-[#2680BE]/30"
            title="Profile"
          >
            {user?.name ? getInitial(user.name) : <UserCircle size={24} />}
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 top-14 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
              <div className="bg-gradient-to-r from-[#002248] to-[#2680BE] px-5 py-5 text-white">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/40 bg-white/10 text-sm font-bold">
                      {getInitial(user?.name)}
                    </div>

                    <div>
                      <p className="text-sm font-bold">
                        {user?.name || "Admin Takah"}
                      </p>
                      <p className="mt-0.5 text-xs text-white/75">
                        {getRoleLabel(role)}
                      </p>

                      <div className="mt-1 flex items-center gap-1 text-xs font-medium text-emerald-300">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        Online
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsProfileOpen(false)}
                    className="rounded-full p-1 text-white/70 transition hover:bg-white/10 hover:text-white"
                    title="Tutup"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-3 p-5 text-sm">
                <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3">
                  <span className="flex items-center gap-2 text-slate-500">
                    <Clock size={16} />
                    Last Login
                  </span>
                  <span className="font-semibold text-slate-800">
                    Hari ini
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3">
                  <span className="flex items-center gap-2 text-slate-500">
                    <ShieldCheck size={16} />
                    Role
                  </span>
                  <span className="font-semibold text-slate-800">
                    {getRoleLabel(role)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate("/profile");
                  }}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                >
                  Lihat Profile
                </button>
              </div>
            </div>
          )}
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