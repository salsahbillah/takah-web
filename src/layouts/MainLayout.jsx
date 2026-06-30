import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen">
        <aside className="w-64 bg-slate-900 text-white">
          <div className="p-6 border-b border-slate-700">
            <h1 className="text-2xl font-bold">TAKAH</h1>
            <p className="text-sm text-slate-400">
              Smart Letter Management System
            </p>
          </div>

          <nav className="p-4">
            <p className="text-sm text-slate-400">Menu akan dibuat setelah ini</p>
          </nav>
        </aside>

        <main className="flex-1">
          <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
            <div>
              <h2 className="font-semibold text-slate-800">Dashboard</h2>
              <p className="text-sm text-slate-500">
                Kelola administrasi surat secara digital
              </p>
            </div>
          </header>

          <section className="p-6">
            <Outlet />
          </section>
        </main>
      </div>
    </div>
  );
}

export default MainLayout;