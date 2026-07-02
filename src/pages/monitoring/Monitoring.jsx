import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Eye,
  FileText,
  Search,
  X,
  XCircle,
} from "lucide-react";

import { getAllMonitoring } from "../../services/monitoringService";

function Monitoring() {
  const [monitoring, setMonitoring] = useState([]);
  const [detailData, setDetailData] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("semua");
  const [loading, setLoading] = useState(false);

  const fetchMonitoring = async () => {
    try {
      setLoading(true);
      const result = await getAllMonitoring();
      setMonitoring(result.data || []);
    } catch (error) {
      alert("Gagal mengambil data monitoring");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonitoring();
  }, []);

  const filteredMonitoring = useMemo(() => {
    return monitoring.filter((item) => {
      const keyword = search.toLowerCase();

      const matchSearch =
        item.nomor_surat?.toLowerCase().includes(keyword) ||
        item.status?.toLowerCase().includes(keyword) ||
        item.last_approver?.toLowerCase().includes(keyword) ||
        item.last_notes?.toLowerCase().includes(keyword);

      const matchStatus =
        statusFilter === "semua" || item.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [monitoring, search, statusFilter]);

  const summary = {
    total: monitoring.length,
    pending: monitoring.filter((item) => item.status === "pending").length,
    approved: monitoring.filter((item) => item.status === "approved").length,
    rejected: monitoring.filter((item) => item.status === "rejected").length,
  };

  const getStatusClass = (status) => {
    if (status === "draft") return "bg-slate-100 text-slate-700";
    if (status === "pending") return "bg-orange-100 text-orange-700";
    if (status === "approved") return "bg-emerald-100 text-emerald-700";
    if (status === "rejected") return "bg-red-100 text-red-700";
    if (status === "completed") return "bg-blue-100 text-blue-700";
    return "bg-slate-100 text-slate-700";
  };

  const getStatusLabel = (status) => {
    if (status === "draft") return "Draft";
    if (status === "pending") return "Pending";
    if (status === "approved") return "Approved";
    if (status === "rejected") return "Rejected";
    if (status === "completed") return "Completed";
    return "-";
  };

  const summaryCards = [
    {
      title: "Total Monitoring",
      value: summary.total,
      icon: FileText,
      bgIcon: "bg-blue-100",
      textIcon: "text-blue-600",
    },
    {
      title: "Pending",
      value: summary.pending,
      icon: Clock3,
      bgIcon: "bg-orange-100",
      textIcon: "text-orange-600",
    },
    {
      title: "Approved",
      value: summary.approved,
      icon: CheckCircle2,
      bgIcon: "bg-emerald-100",
      textIcon: "text-emerald-600",
    },
    {
      title: "Rejected",
      value: summary.rejected,
      icon: XCircle,
      bgIcon: "bg-red-100",
      textIcon: "text-red-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-linear-to-r from-[#082f5f] via-[#0f5f99] to-[#2b8fd3] p-8 shadow-lg">
        <p className="text-sm font-medium text-blue-100">Tracking Surat</p>
        <h1 className="mt-1 text-4xl font-bold text-white">
          Monitoring Surat
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-blue-100">
          Pantau status terakhir surat, approver, catatan review, dan waktu
          perubahan surat.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div
                className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${card.bgIcon}`}
              >
                <Icon className={card.textIcon} size={23} />
              </div>

              <p className="text-sm font-semibold text-slate-600">
                {card.title}
              </p>
              <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
                {card.value}
              </h2>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Daftar Monitoring Surat
            </h2>
            <p className="text-sm text-slate-500">
              Data status surat berdasarkan proses approval dan perubahan
              terakhir.
            </p>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative w-full lg:w-80">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nomor surat..."
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="semua">Semua Status</option>
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-100">
          <table className="w-full min-w-240 border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-sm text-slate-600">
                <th className="px-4 py-4 font-semibold">No</th>
                <th className="px-4 py-4 font-semibold">Nomor Surat</th>
                <th className="px-4 py-4 font-semibold">Status</th>
                <th className="px-4 py-4 font-semibold">Approver Terakhir</th>
                <th className="px-4 py-4 font-semibold">Catatan</th>
                <th className="px-4 py-4 font-semibold">Update Terakhir</th>
                <th className="px-4 py-4 text-center font-semibold">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 py-10 text-center text-sm text-slate-500"
                  >
                    Memuat data monitoring...
                  </td>
                </tr>
              ) : filteredMonitoring.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 py-10 text-center text-sm text-slate-500"
                  >
                    Belum ada data monitoring.
                  </td>
                </tr>
              ) : (
                filteredMonitoring.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-b border-slate-100 text-sm text-slate-700 transition hover:bg-slate-50"
                  >
                    <td className="px-4 py-4">{index + 1}</td>

                    <td className="px-4 py-4 font-bold text-slate-900">
                      {item.nomor_surat || "-"}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                          item.status
                        )}`}
                      >
                        {getStatusLabel(item.status)}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      {item.last_approver || "-"}
                    </td>

                    <td className="px-4 py-4">
                      {item.last_notes || "-"}
                    </td>

                    <td className="px-4 py-4">
                      {item.updated_at || "-"}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex justify-center">
                        <button
                          onClick={() => setDetailData(item)}
                          className="rounded-lg bg-blue-100 p-2 text-blue-700 transition hover:bg-blue-200"
                          title="Detail Monitoring"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {detailData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between bg-linear-to-r from-[#082f5f] to-[#2b8fd3] px-7 py-5 text-white">
              <div>
                <h2 className="text-xl font-bold">Detail Monitoring Surat</h2>
                <p className="mt-1 text-sm text-blue-100">
                  Riwayat status dan proses terakhir surat.
                </p>
              </div>

              <button
                onClick={() => setDetailData(null)}
                className="rounded-xl p-2 transition hover:bg-white/10"
              >
                <X size={22} />
              </button>
            </div>

            <div className="space-y-5 p-7">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Nomor Surat
                </p>
                <p className="mt-2 text-2xl font-extrabold text-slate-900">
                  {detailData.nomor_surat || "-"}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">Status</p>
                  <span
                    className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                      detailData.status
                    )}`}
                  >
                    {getStatusLabel(detailData.status)}
                  </span>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">Approver</p>
                  <p className="mt-3 font-bold text-slate-900">
                    {detailData.last_approver || "-"}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">Updated</p>
                  <p className="mt-3 font-bold text-slate-900">
                    {detailData.updated_at || "-"}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Catatan Terakhir</p>
                <p className="mt-2 rounded-xl bg-slate-50 p-4 text-sm font-semibold text-slate-700">
                  {detailData.last_notes || "Belum ada catatan."}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="mb-5 text-base font-bold text-slate-900">
                  Timeline Surat
                </h3>

                <div className="relative space-y-6 border-l-2 border-slate-200 pl-6">
                  <div className="relative">
                    <span className="absolute -left-[31px] top-1 h-4 w-4 rounded-full border-4 border-white bg-blue-500 shadow" />
                    <p className="font-bold text-slate-900">Surat masuk sistem</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {detailData.created_at || "-"}
                    </p>
                  </div>

                  <div className="relative">
                    <span className="absolute -left-[31px] top-1 h-4 w-4 rounded-full border-4 border-white bg-orange-500 shadow" />
                    <p className="font-bold text-slate-900">
                      Proses approval diperbarui
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {detailData.updated_at || "-"}
                    </p>
                  </div>

                  <div className="relative">
                    <span
                      className={`absolute -left-[31px] top-1 h-4 w-4 rounded-full border-4 border-white shadow ${
                        detailData.status === "approved"
                          ? "bg-emerald-500"
                          : detailData.status === "rejected"
                          ? "bg-red-500"
                          : "bg-slate-300"
                      }`}
                    />
                    <p className="font-bold text-slate-900">
                      Status terakhir: {getStatusLabel(detailData.status)}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {detailData.last_notes || "Belum ada catatan keputusan."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setDetailData(null)}
                  className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Monitoring;