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
import Pagination from "../../components/common/Pagination";

function Monitoring() {
  const [monitoring, setMonitoring] = useState([]);
  const [detailData, setDetailData] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("semua");
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

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

  const paginatedMonitoring = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredMonitoring.slice(start, start + itemsPerPage);
  }, [filteredMonitoring, currentPage]);

  const summary = {
    total: monitoring.length,
    pending: monitoring.filter((item) => item.status === "pending").length,
    approved: monitoring.filter((item) => item.status === "approved").length,
    rejected: monitoring.filter((item) => item.status === "rejected").length,
  };

  const getStatusClass = (status) => {
    if (status === "pending") return "bg-orange-100 text-orange-700";
    if (status === "approved") return "bg-emerald-100 text-emerald-700";
    if (status === "rejected") return "bg-red-100 text-red-700";
    if (status === "completed") return "bg-blue-100 text-blue-700";
    return "bg-slate-100 text-slate-700";
  };

  const getStatusLabel = (status) => {
    if (status === "pending") return "Pending";
    if (status === "approved") return "Approved";
    if (status === "rejected") return "Rejected";
    if (status === "completed") return "Completed";
    return status || "-";
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
    <div className="min-h-screen bg-slate-50 px-3 py-4 text-[13px] sm:px-4 lg:px-5">
      <div className="mx-auto w-full max-w-[1180px] space-y-4">
        <div className="rounded-2xl bg-gradient-to-r from-[#082f5f] via-[#0f5f99] to-[#2b8fd3] p-5 text-white shadow-md sm:p-6">
          <p className="text-xs font-semibold text-blue-100">Tracking Surat</p>
          <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">
            Monitoring Surat
          </h1>
          <p className="mt-2 max-w-3xl text-xs leading-6 text-blue-100 sm:text-sm">
            Pantau status terakhir surat, approver, catatan review, dan waktu
            perubahan surat.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {summaryCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div
                  className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${card.bgIcon}`}
                >
                  <Icon className={card.textIcon} size={20} />
                </div>

                <p className="text-xs font-semibold text-slate-600">
                  {card.title}
                </p>
                <h2 className="mt-1 text-2xl font-extrabold text-slate-900">
                  {card.value}
                </h2>
              </div>
            );
          })}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Daftar Monitoring Surat
              </h2>
              <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                Data status surat berdasarkan proses approval dan perubahan
                terakhir.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative w-full sm:w-72">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari nomor surat..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-600 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="semua">Semua Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full min-w-[850px] border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs text-slate-600">
                  <th className="w-12 px-4 py-3 font-bold">No</th>
                  <th className="px-4 py-3 font-bold">Nomor Surat</th>
                  <th className="px-4 py-3 font-bold">Status</th>
                  <th className="px-4 py-3 font-bold">Approver</th>
                  <th className="px-4 py-3 font-bold">Catatan</th>
                  <th className="px-4 py-3 font-bold">Update</th>
                  <th className="px-4 py-3 text-center font-bold">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-4 py-8 text-center text-xs text-slate-500"
                    >
                      Memuat data monitoring...
                    </td>
                  </tr>
                ) : filteredMonitoring.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-4 py-8 text-center text-xs text-slate-500"
                    >
                      Belum ada data monitoring.
                    </td>
                  </tr>
                ) : (
                  paginatedMonitoring.map((item, index) => (
                    <tr
                      key={item.id}
                      className="border-b border-slate-100 text-xs text-slate-700 transition hover:bg-blue-50/40"
                    >
                      <td className="px-4 py-3">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>

                      <td className="px-4 py-3 font-extrabold text-slate-900">
                        {item.nomor_surat || "-"}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-3 py-1 text-[11px] font-bold ${getStatusClass(
                            item.status
                          )}`}
                        >
                          {getStatusLabel(item.status)}
                        </span>
                      </td>

                      <td className="px-4 py-3 font-medium">
                        {item.last_approver || "-"}
                      </td>

                      <td className="max-w-[220px] px-4 py-3">
                        <p className="line-clamp-2">
                          {item.last_notes || "-"}
                        </p>
                      </td>

                      <td className="px-4 py-3">{item.updated_at || "-"}</td>

                      <td className="px-4 py-3">
                        <div className="flex justify-center">
                          <button
                            onClick={() => setDetailData(item)}
                            className="rounded-lg bg-blue-100 p-2 text-blue-700 transition hover:bg-blue-200"
                            title="Detail Monitoring"
                          >
                            <Eye size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalItems={filteredMonitoring.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {detailData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between bg-gradient-to-r from-[#082f5f] to-[#2b8fd3] px-5 py-4 text-white">
              <div>
                <h2 className="text-base font-extrabold">
                  Detail Monitoring Surat
                </h2>
                <p className="mt-1 text-xs text-blue-100">
                  Riwayat status dan proses terakhir surat.
                </p>
              </div>

              <button
                onClick={() => setDetailData(null)}
                className="rounded-lg p-2 transition hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                  Nomor Surat
                </p>
                <p className="mt-2 text-xl font-extrabold text-slate-900">
                  {detailData.nomor_surat || "-"}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xs text-slate-500">Status</p>
                  <span
                    className={`mt-3 inline-block rounded-full px-3 py-1 text-[11px] font-bold ${getStatusClass(
                      detailData.status
                    )}`}
                  >
                    {getStatusLabel(detailData.status)}
                  </span>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xs text-slate-500">Approver</p>
                  <p className="mt-3 font-bold text-slate-900">
                    {detailData.last_approver || "-"}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xs text-slate-500">Updated</p>
                  <p className="mt-3 font-bold text-slate-900">
                    {detailData.updated_at || "-"}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs text-slate-500">Catatan Terakhir</p>
                <p className="mt-2 rounded-xl bg-slate-50 p-3 text-xs font-semibold leading-6 text-slate-700">
                  {detailData.last_notes || "Belum ada catatan."}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="mb-4 text-sm font-extrabold text-slate-900">
                  Timeline Surat
                </h3>

                <div className="relative space-y-5 border-l-2 border-slate-200 pl-6">
                  <div className="relative">
                    <span className="absolute -left-[31px] top-1 h-4 w-4 rounded-full border-4 border-white bg-blue-500 shadow" />
                    <p className="font-bold text-slate-900">
                      Surat masuk sistem
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {detailData.created_at || "-"}
                    </p>
                  </div>

                  <div className="relative">
                    <span className="absolute -left-[31px] top-1 h-4 w-4 rounded-full border-4 border-white bg-orange-500 shadow" />
                    <p className="font-bold text-slate-900">
                      Proses approval diperbarui
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
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
                    <p className="mt-1 text-xs text-slate-500">
                      {detailData.last_notes || "Belum ada catatan keputusan."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setDetailData(null)}
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700"
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