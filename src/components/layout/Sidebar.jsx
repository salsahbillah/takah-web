import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  FileInput,
  FileCheck,
  Settings,
  ClipboardList,
  FolderKanban,
  User,
  CheckSquare,
  MonitorCheck,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import logoTakah from "../../assets/logo/logo-takah-icon.png";

function Sidebar() {
  const { role } = useAuth();

  const adminMenus = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Master Takah", path: "/takah", icon: FolderKanban },
    { name: "Parameter Surat", path: "/parameter", icon: ClipboardList },
    { name: "Template Surat", path: "/template", icon: FileText },
    { name: "Config Nomor", path: "/config", icon: Settings },
    { name: "Surat Keluar", path: "/surat-keluar", icon: FileCheck },
    { name: "Surat Masuk", path: "/surat-masuk", icon: FileInput },
    { name: "Approval", path: "/approval", icon: CheckSquare },
    { name: "Monitoring", path: "/monitoring", icon: MonitorCheck },
    { name: "Profile", path: "/profile", icon: User },
  ];

  const userMenus = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Buat Surat", path: "/surat-keluar", icon: FileCheck },
    { name: "Monitoring", path: "/monitoring", icon: MonitorCheck },
    { name: "Profile", path: "/profile", icon: User },
  ];

  const menus = role === "admin" ? adminMenus : userMenus;

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-72 overflow-hidden bg-[#071f46] text-white shadow-2xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(38,128,190,0.55),transparent_35%),linear-gradient(180deg,rgba(0,34,72,0.94),rgba(0,34,72,0.84))]" />

      <div className="absolute inset-0 bg-[url('/src/assets/logo/logo-takah-icon.png')] bg-size-[420px] bg-center bg-no-repeat opacity-[0.04]" />

      <div className="relative flex h-full flex-col backdrop-blur-sm">
        <div className="flex h-24 items-center gap-3 border-b border-white/10 px-6">
          <img
            src={logoTakah}
            alt="Logo TAKAH"
            className="h-11 w-11 object-contain"
          />

          <div>
            <h1 className="text-2xl font-extrabold italic leading-none tracking-wide">
              Takah
            </h1>
            <p className="mt-1 text-sm text-white/60">Sistem Surat Digital</p>
          </div>
        </div>

        <nav className="mt-5 flex-1 space-y-1.5 px-4">
          {menus.map((menu) => {
            const Icon = menu.icon;

            return (
              <NavLink
                key={menu.path}
                to={menu.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-[#2680BE]/90 text-white shadow-lg shadow-blue-950/30"
                      : "text-white/75 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon size={20} />
                <span>{menu.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;