import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import Approval from "../pages/approval/Approval";
import ConfigNomor from "../pages/config/ConfigNomor";
import Monitoring from "../pages/monitoring/Monitoring";
import ParameterSurat from "../pages/parameter/ParameterSurat";
import Profile from "../pages/profile/Profile";
import SuratKeluar from "../pages/surat-keluar/SuratKeluar";
import SuratMasuk from "../pages/surat-masuk/SuratMasuk";
import MasterTakah from "../pages/takah/MasterTakah";
import TemplateSurat from "../pages/template/TemplateSurat";

import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import BuatSurat from "../pages/buat-surat/BuatSurat";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/takah" element={<MasterTakah />} />
            <Route path="/parameter" element={<ParameterSurat />} />
            <Route path="/template" element={<TemplateSurat />} />
            <Route path="/config" element={<ConfigNomor />} />
            <Route path="/surat-keluar" element={<SuratKeluar />} />
            <Route path="/surat-masuk" element={<SuratMasuk />} />
            <Route path="/approval" element={<Approval />} />
            <Route path="/monitoring" element={<Monitoring />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/buat-surat" element={<BuatSurat />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;