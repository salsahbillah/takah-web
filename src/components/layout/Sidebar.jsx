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
    { name: "Surat Masuk", path: "/surat-masuk", icon: FileInput },
    { name: "Monitoring", path: "/monitoring", icon: MonitorCheck },
    { name: "Profile", path: "/profile", icon: User },
  ];

  const menus = role === "admin" ? adminMenus : userMenus;

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-72 bg-[#002248] text-white shadow-xl">
      <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
        <img src={logoTakah} alt="Logo TAKAH" className="h-11 w-11 object-contain" />

        <div>
          <h1 className="text-xl font-extrabold italic leading-none">Takah</h1>
          <p className="mt-1 text-xs text-white/60">Sistem Surat Digital</p>
        </div>
      </div>

      <nav className="mt-6 space-y-2 px-4">
        {menus.map((menu) => {
          const Icon = menu.icon;

          return (
            <NavLink
              key={menu.path}
              to={menu.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-[#2680BE] text-white shadow-lg"
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
    </aside>
  );
}

export default Sidebar;