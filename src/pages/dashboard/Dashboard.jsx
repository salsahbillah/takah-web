import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Download,
  FileCheck,
  FileInput,
  FileText,
  Send,
  TrendingUp,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { getDashboardData } from "../../services/dashboardService";

function Dashboard() {
  const { user, role } = useAuth();

  const isAdmin = role === "admin";

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const data = await getDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error("Gagal mengambil data dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const summary = dashboardData?.summary || {
    total_surat: 0,
    surat_keluar: 0,
    surat_masuk: 0,
    approval: 0,
    pending: 0,
  };

  const monitoringData =
    dashboardData?.chart?.length > 0
      ? dashboardData.chart
      : [
          { month: "Jan", keluar: 0, masuk: 0 },
          { month: "Feb", keluar: 0, masuk: 0 },
          { month: "Mar", keluar: 0, masuk: 0 },
          { month: "Apr", keluar: 0, masuk: 0 },
          { month: "Mei", keluar: 0, masuk: 0 },
          { month: "Jun", keluar: 0, masuk: 0 },
          { month: "Jul", keluar: 0, masuk: 0 },
          { month: "Agu", keluar: 0, masuk: 0 },
          { month: "Sep", keluar: 0, masuk: 0 },
          { month: "Okt", keluar: 0, masuk: 0 },
          { month: "Nov", keluar: 0, masuk: 0 },
          { month: "Des", keluar: 0, masuk: 0 },
        ];

  const activities =
    dashboardData?.activities?.length > 0
      ? dashboardData.activities.map((item, index) => ({
          title: item.title,
          subtitle: item.subtitle,
          time: item.time,
          color:
            index === 0
              ? "bg-blue-500"
              : index === 1
              ? "bg-emerald-500"
              : "bg-orange-500",
        }))
      : [];

  const latestLetters =
    dashboardData?.latest_letters?.length > 0
      ? dashboardData.latest_letters.map((item) => ({
          no: item.nomor_surat,
          perihal: item.perihal,
          jenis: item.jenis_surat,
          pengirim: item.pengirim,
          tanggal: item.tanggal_surat,
          status: item.status,
          statusClass:
            item.status === "approved"
              ? "bg-emerald-100 text-emerald-700"
              : item.status === "pending"
              ? "bg-orange-100 text-orange-700"
              : item.status === "rejected"
              ? "bg-red-100 text-red-700"
              : "bg-blue-100 text-blue-700",
        }))
      : [];

  const stats = isAdmin
    ? [
        {
          title: "Total Surat",
          value: summary.total_surat,
          icon: FileText,
          path: "/monitoring",
          bgIcon: "bg-blue-100",
          textIcon: "text-blue-600",
        },
        {
          title: "Surat Keluar",
          value: summary.surat_keluar,
          icon: Send,
          path: "/surat-keluar",
          bgIcon: "bg-emerald-100",
          textIcon: "text-emerald-600",
        },
        {
          title: "Surat Masuk",
          value: summary.surat_masuk,
          icon: Download,
          path: "/surat-masuk",
          bgIcon: "bg-purple-100",
          textIcon: "text-purple-600",
        },
        {
          title: "Approval",
          value: summary.approval,
          icon: CheckCircle2,
          path: "/approval",
          bgIcon: "bg-orange-100",
          textIcon: "text-orange-600",
        },
        {
          title: "Pending",
          value: summary.pending,
          icon: Clock3,
          path: "/monitoring",
          bgIcon: "bg-red-100",
          textIcon: "text-red-600",
        },
      ]
    : [
        {
          title: "Surat Saya",
          value: summary.total_surat,
          icon: FileText,
          path: "/monitoring",
          bgIcon: "bg-blue-100",
          textIcon: "text-blue-600",
        },
        {
          title: "Surat Keluar Saya",
          value: summary.surat_keluar,
          icon: Send,
          path: "/surat-keluar",
          bgIcon: "bg-emerald-100",
          textIcon: "text-emerald-600",
        },
        {
          title: "Surat Masuk Saya",
          value: summary.surat_masuk,
          icon: Download,
          path: "/surat-masuk",
          bgIcon: "bg-purple-100",
          textIcon: "text-purple-600",
        },
        {
          title: "Disetujui",
          value: summary.approval,
          icon: CheckCircle2,
          path: "/monitoring",
          bgIcon: "bg-orange-100",
          textIcon: "text-orange-600",
        },
        {
          title: "Pending Saya",
          value: summary.pending,
          icon: Clock3,
          path: "/monitoring",
          bgIcon: "bg-red-100",
          textIcon: "text-red-600",
        },
      ];

  const quickMenus = isAdmin
    ? [
        {
          title: "Buat Surat Baru",
          path: "/surat-keluar",
          icon: FileCheck,
          bgIcon: "bg-blue-100",
          textIcon: "text-blue-600",
        },
        {
          title: "Surat Keluar",
          path: "/surat-keluar",
          icon: Send,
          bgIcon: "bg-emerald-100",
          textIcon: "text-emerald-600",
        },
        {
          title: "Surat Masuk",
          path: "/surat-masuk",
          icon: FileInput,
          bgIcon: "bg-purple-100",
          textIcon: "text-purple-600",
        },
        {
          title: "Approval",
          path: "/approval",
          icon: CheckCircle2,
          bgIcon: "bg-orange-100",
          textIcon: "text-orange-600",
        },
      ]
    : [
        {
          title: "Buat Surat Baru",
          path: "/surat-keluar",
          icon: FileCheck,
          bgIcon: "bg-blue-100",
          textIcon: "text-blue-600",
        },
        {
          title: "Surat Saya",
          path: "/monitoring",
          icon: FileText,
          bgIcon: "bg-emerald-100",
          textIcon: "text-emerald-600",
        },
        {
          title: "Surat Masuk Saya",
          path: "/surat-masuk",
          icon: FileInput,
          bgIcon: "bg-purple-100",
          textIcon: "text-purple-600",
        },
        {
          title: "Profile Saya",
          path: "/profile",
          icon: CheckCircle2,
          bgIcon: "bg-orange-100",
          textIcon: "text-orange-600",
        },
      ];

  const getRoleLabel = (roleValue) => {
    if (roleValue === "admin") return "Administrator";
    if (roleValue === "user") return "User";
    return "User";
  };

  const chartWidth = 920;
  const chartHeight = 240;
  const chartPaddingTop = 24;
  const chartPaddingBottom = 48;
  const chartPaddingLeft = 36;
  const chartContentHeight = chartHeight - chartPaddingTop - chartPaddingBottom;

  const maxChartValue = Math.max(
    ...monitoringData.flatMap((item) => [item.keluar, item.masuk]),
    10
  );

  const roundedMaxValue = Math.ceil(maxChartValue / 10) * 10 || 10;

  const gridValues = Array.from({ length: 6 }, (_, index) =>
    Math.round((roundedMaxValue / 5) * index)
  );

  const barGroupWidth = chartWidth / monitoringData.length;
  const barWidth = Math.min(24, barGroupWidth / 4);

  const getBarHeight = (value) => {
    return (value / roundedMaxValue) * chartContentHeight;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-4 text-[13px] lg:px-5 lg:py-5">
        <div className="mx-auto w-full max-w-295">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
            Memuat data dashboard...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-4 text-[13px] lg:px-5 lg:py-5">
      <div className="mx-auto w-full max-w-295">
        <div className="mb-4 rounded-2xl bg-linear-to-r from-[#002248] to-[#2680BE] p-5 text-white shadow-md transition hover:shadow-lg">
          <p className="text-xs text-white/75">Selamat datang kembali</p>
          <h2 className="mt-1 text-xl font-extrabold">
            {user?.name || "Admin Takah"}
          </h2>
          <p className="mt-2 max-w-2xl text-xs leading-relaxed text-white/75">
            Anda login sebagai {getRoleLabel(role)}.{" "}
            {isAdmin
              ? "Anda dapat memantau seluruh data surat, approval, dan aktivitas terbaru pada sistem."
              : "Anda dapat melihat surat milik sendiri, status pengajuan, surat masuk, dan aktivitas terbaru akun kamu."}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(280px,0.9fr)]">
          <div className="min-w-0 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {stats.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.title}
                    to={item.path}
                    className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl transition group-hover:scale-105 ${item.bgIcon}`}
                      >
                        <Icon className={item.textIcon} size={21} />
                      </div>

                      <TrendingUp
                        className="text-slate-300 transition group-hover:text-blue-500"
                        size={18}
                      />
                    </div>

                    <div className="mt-4">
                      <p className="text-xs font-semibold text-slate-600">
                        {item.title}
                      </p>
                      <h3 className="mt-1 text-2xl font-extrabold text-slate-900">
                        {item.value}
                      </h3>
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-xs font-bold text-blue-600">
                      Lihat Detail
                      <ArrowRight
                        size={14}
                        className="transition group-hover:translate-x-1"
                      />
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
              <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {isAdmin
                      ? "Grafik Surat Per Bulan"
                      : "Grafik Surat Saya Per Bulan"}
                  </h3>

                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                      {isAdmin ? "Surat Keluar" : "Surat Keluar Saya"}
                    </span>

                    <span className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                      {isAdmin ? "Surat Masuk" : "Surat Masuk Saya"}
                    </span>
                  </div>
                </div>

                <select className="w-fit rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 outline-none transition hover:border-blue-300 focus:border-blue-400">
                  <option>2026</option>
                  <option>2025</option>
                </select>
              </div>

              <div className="max-h-80 w-full overflow-auto rounded-xl border border-slate-100 bg-slate-50 p-3">
                <svg
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  className="h-70 "
                  role="img"
                  aria-label="Grafik surat per bulan"
                >
                  {gridValues.map((value) => {
                    const y =
                      chartPaddingTop +
                      chartContentHeight -
                      (value / roundedMaxValue) * chartContentHeight;

                    return (
                      <g key={value}>
                        <line
                          x1={chartPaddingLeft}
                          y1={y}
                          x2={chartWidth}
                          y2={y}
                          stroke="#E2E8F0"
                          strokeDasharray="5 5"
                        />
                        <text x="0" y={y + 4} fontSize="10" fill="#64748B">
                          {value}
                        </text>
                      </g>
                    );
                  })}

                  {monitoringData.map((item, index) => {
                    const groupX =
                      chartPaddingLeft +
                      index * barGroupWidth +
                      barGroupWidth / 2;

                    const keluarHeight = getBarHeight(item.keluar);
                    const masukHeight = getBarHeight(item.masuk);

                    const keluarY =
                      chartPaddingTop + chartContentHeight - keluarHeight;
                    const masukY =
                      chartPaddingTop + chartContentHeight - masukHeight;

                    return (
                      <g key={item.month}>
                        <rect
                          x={groupX - barWidth - 3}
                          y={keluarY}
                          width={barWidth}
                          height={keluarHeight}
                          rx="6"
                          fill="#2563EB"
                          className="transition hover:opacity-80"
                        />

                        <rect
                          x={groupX + 3}
                          y={masukY}
                          width={barWidth}
                          height={masukHeight}
                          rx="6"
                          fill="#22C55E"
                          className="transition hover:opacity-80"
                        />

                        <text
                          x={groupX - barWidth / 2 - 3}
                          y={keluarY - 6}
                          textAnchor="middle"
                          fontSize="10"
                          fill="#2563EB"
                          fontWeight="700"
                        >
                          {item.keluar}
                        </text>

                        <text
                          x={groupX + barWidth / 2 + 3}
                          y={masukY - 6}
                          textAnchor="middle"
                          fontSize="10"
                          fill="#16A34A"
                          fontWeight="700"
                        >
                          {item.masuk}
                        </text>

                        <text
                          x={groupX}
                          y={chartHeight - 18}
                          textAnchor="middle"
                          fontSize="11"
                          fill="#64748B"
                          fontWeight="600"
                        >
                          {item.month}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              <p className="mt-3 text-[11px] text-slate-500">
                Scroll grafik ke kanan, kiri, atas, atau bawah jika data tidak
                terlihat penuh.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-extrabold text-slate-900">
                  {isAdmin ? "Surat Terbaru" : "Surat Saya Terbaru"}
                </h3>

                <Link
                  to="/monitoring"
                  className="text-xs font-bold text-blue-600 transition hover:text-blue-700"
                >
                  Lihat Semua
                </Link>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full min-w-170 border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
                      <th className="px-4 py-3 font-bold">No. Surat</th>
                      <th className="px-4 py-3 font-bold">Perihal</th>
                      <th className="px-4 py-3 font-bold">Jenis Surat</th>
                      <th className="px-4 py-3 font-bold">Pengirim</th>
                      <th className="px-4 py-3 font-bold">Tanggal</th>
                      <th className="px-4 py-3 font-bold">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {latestLetters.length > 0 ? (
                      latestLetters.map((letter) => (
                        <tr
                          key={letter.no}
                          className="border-b border-slate-100 text-slate-700 transition hover:bg-slate-50"
                        >
                          <td className="px-4 py-3 font-bold text-slate-800">
                            {letter.no}
                          </td>
                          <td className="px-4 py-3">{letter.perihal}</td>
                          <td className="px-4 py-3">{letter.jenis}</td>
                          <td className="px-4 py-3">{letter.pengirim}</td>
                          <td className="px-4 py-3">{letter.tanggal}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`rounded-full px-3 py-1 text-[11px] font-bold ${letter.statusClass}`}
                            >
                              {letter.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="px-4 py-6 text-center text-slate-500"
                        >
                          Belum ada data surat terbaru.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="min-w-0 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-extrabold text-slate-900">
                  Aktivitas Terbaru
                </h3>

                <Link
                  to="/monitoring"
                  className="text-xs font-bold text-blue-600 transition hover:text-blue-700"
                >
                  Lihat Semua
                </Link>
              </div>

              <div className="space-y-4">
                {activities.length > 0 ? (
                  activities.map((activity) => (
                    <div
                      key={activity.title}
                      className="group flex gap-3 rounded-xl p-2 transition hover:bg-slate-50"
                    >
                      <div className="flex flex-col items-center">
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${activity.color}`}
                        />
                        <span className="mt-1 h-full w-px bg-slate-200" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-bold leading-snug text-slate-800 group-hover:text-blue-700">
                              {activity.title}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {activity.subtitle}
                            </p>
                          </div>

                          <p className="whitespace-nowrap text-[11px] font-medium text-slate-500">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="rounded-xl bg-slate-50 px-4 py-5 text-center text-xs text-slate-500">
                    Belum ada aktivitas terbaru.
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
              <h3 className="mb-4 text-base font-extrabold text-slate-900">
                Quick Menu
              </h3>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1">
                {quickMenus.map((menu) => {
                  const Icon = menu.icon;

                  return (
                    <Link
                      key={menu.title}
                      to={menu.path}
                      className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/40 hover:shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl transition group-hover:scale-105 ${menu.bgIcon}`}
                        >
                          <Icon className={menu.textIcon} size={20} />
                        </div>

                        <p className="text-xs font-bold text-slate-800">
                          {menu.title}
                        </p>
                      </div>

                      <ArrowRight
                        size={16}
                        className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600"
                      />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;