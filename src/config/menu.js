import {
    LayoutDashboard,
    FolderKanban,
    ClipboardList,
    FileText,
    Settings,
    FileCheck,
    FileInput,
    CheckSquare,
    MonitorCheck,
    User,
  } from "lucide-react";
  
  export const adminMenus = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Master Takah",
      path: "/takah",
      icon: FolderKanban,
    },
    {
      title: "Parameter Surat",
      path: "/parameter",
      icon: ClipboardList,
    },
    {
      title: "Template Surat",
      path: "/template",
      icon: FileText,
    },
    {
      title: "Config Nomor Surat",
      path: "/config",
      icon: Settings,
    },
    {
      title: "Surat Keluar",
      path: "/surat-keluar",
      icon: FileCheck,
    },
    {
      title: "Surat Masuk",
      path: "/surat-masuk",
      icon: FileInput,
    },
    {
      title: "Approval Surat",
      path: "/approval",
      icon: CheckSquare,
    },
    {
      title: "Monitoring Surat",
      path: "/monitoring",
      icon: MonitorCheck,
    },
    {
      title: "Profile",
      path: "/profile",
      icon: User,
    },
  ];
  
  export const userMenus = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Buat Surat",
      path: "/surat-keluar",
      icon: FileCheck,
    },
    {
      title: "Surat Masuk",
      path: "/surat-masuk",
      icon: FileInput,
    },
    {
      title: "Monitoring Surat",
      path: "/monitoring",
      icon: MonitorCheck,
    },
    {
      title: "Profile",
      path: "/profile",
      icon: User,
    },
  ];