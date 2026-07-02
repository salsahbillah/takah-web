import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Eye,
  FileText,
  Search,
  Send,
  X,
  XCircle,
} from "lucide-react";

import { getAllApproval, updateApproval } from "../../services/approvalService";
import { getSuratKeluarById } from "../../services/suratKeluarService";

function Approval() {
  const [approvals, setApprovals] = useState([]);
  const [detailData, setDetailData] = useState(null);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [notes, setNotes] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("semua");
  const [loading, setLoading] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const fetchApprovals = async () => {
    try {
      setLoading(true);
      const result = await getAllApproval();
      setApprovals(result.data || []);
    } catch (error) {
      alert("Gagal mengambil data approval");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const filteredApprovals = useMemo(() => {
    return approvals.filter((item) => {
      const keyword = search.toLowerCase();

      const matchSearch =
        item.nomor_surat?.toLowerCase().includes(keyword) ||
        item.approver_name?.toLowerCase().includes(keyword) ||
        item.approval_status?.toLowerCase().includes(keyword);

      const matchStatus =
        statusFilter === "semua" || item.approval_status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [approvals, search, statusFilter]);

  const summary = {
    total: approvals.length,
    pending: approvals.filter((item) => item.approval_status === "pending")
      .length,
    approved: approvals.filter((item) => item.approval_status === "approved")
      .length,
    rejected: approvals.filter((item) => item.approval_status === "rejected")
      .length,
  };

  const getStatusClass = (status) => {
    if (status === "pending") return "bg-orange-100 text-orange-700";
    if (status === "approved") return "bg-emerald-100 text-emerald-700";
    if (status === "rejected") return "bg-red-100 text-red-700";
    return "bg-slate-100 text-slate-700";
  };

  const getStatusLabel = (status) => {
    if (status === "pending") return "Pending";
    if (status === "approved") return "Approved";
    if (status === "rejected") return "Rejected";
    return "-";
  };

  const openDetail = async (approval) => {
    try {
      const result = await getSuratKeluarById(approval.surat_keluar_id);
      setDetailData(result.data);
      setSelectedApproval(approval);
      setNotes(approval.notes || "");
      setShowDetail(true);
    } catch (error) {
      alert("Gagal mengambil detail surat");
      console.error(error);
    }
  };

  const closeDetail = () => {
    setShowDetail(false);
    setDetailData(null);
    setSelectedApproval(null);
    setNotes("");
  };

  const handleDecision = async (status) => {
    if (!selectedApproval) return;

    const confirmText =
      status === "approved"
        ? "Yakin ingin approve surat ini?"
        : "Yakin ingin reject surat ini?";

    if (!confirm(confirmText)) return;

    try {
      await updateApproval(selectedApproval.id, {
        surat_keluar_id: selectedApproval.surat_keluar_id,
        approver_id: 1,
        approver_name: "Admin Takah",
        approval_status: status,
        notes,
      });

      alert(
        status === "approved"
          ? "Surat berhasil diapprove"
          : "Surat berhasil direject"
      );

      closeDetail();
      fetchApprovals();
    } catch (error) {
      alert(error.response?.data?.message || "Gagal memproses approval");
      console.error(error);
    }
  };

  const summaryCards = [
    {
      title: "Total Approval",
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
        <p className="text-sm font-medium text-blue-100">Review Surat</p>
        <h1 className="mt-1 text-4xl font-bold text-white">Approval Surat</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-blue-100">
          Kelola surat keluar yang diajukan untuk direview, disetujui, atau
          ditolak.
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
              Daftar Approval Surat
            </h2>
            <p className="text-sm text-slate-500">
              Surat yang sudah diajukan dari modul Surat Keluar akan tampil di
              sini.
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
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-100">
          <table className="w-full min-w-230 border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-sm text-slate-600">
                <th className="px-4 py-4 font-semibold">No</th>
                <th className="px-4 py-4 font-semibold">Nomor Surat</th>
                <th className="px-4 py-4 font-semibold">Approver</th>
                <th className="px-4 py-4 font-semibold">Status</th>
                <th className="px-4 py-4 font-semibold">Catatan</th>
                <th className="px-4 py-4 font-semibold">Tanggal</th>
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
                    Memuat data approval...
                  </td>
                </tr>
              ) : filteredApprovals.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 py-10 text-center text-sm text-slate-500"
                  >
                    Belum ada data approval.
                  </td>
                </tr>
              ) : (
                filteredApprovals.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-b border-slate-100 text-sm text-slate-700 transition hover:bg-slate-50"
                  >
                    <td className="px-4 py-4">{index + 1}</td>
                    <td className="px-4 py-4 font-bold text-slate-900">
                      {item.nomor_surat}
                    </td>
                    <td className="px-4 py-4">{item.approver_name || "-"}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                          item.approval_status
                        )}`}
                      >
                        {getStatusLabel(item.approval_status)}
                      </span>
                    </td>
                    <td className="px-4 py-4">{item.notes || "-"}</td>
                    <td className="px-4 py-4">{item.created_at || "-"}</td>
                    <td className="px-4 py-4">
                      <div className="flex justify-center">
                        <button
                          onClick={() => openDetail(item)}
                          className="rounded-lg bg-blue-100 p-2 text-blue-700 transition hover:bg-blue-200"
                          title="Review"
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

      {showDetail && detailData && selectedApproval && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between bg-linear-to-r from-[#082f5f] to-[#2b8fd3] px-7 py-5 text-white">
              <div>
                <h2 className="text-xl font-bold">Review Approval Surat</h2>
                <p className="mt-1 text-sm text-blue-100">
                  Periksa isi surat sebelum memberikan keputusan.
                </p>
              </div>

              <button
                onClick={closeDetail}
                className="rounded-xl p-2 transition hover:bg-white/10"
              >
                <X size={22} />
              </button>
            </div>

            <div className="grid gap-5 p-7 lg:grid-cols-[300px_minmax(0,1fr)]">
              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Nomor Surat
                  </p>
                  <p className="mt-2 text-lg font-extrabold text-slate-900">
                    {detailData.nomor_surat || "-"}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="space-y-4 text-sm">
                    <div>
                      <p className="text-slate-500">Jenis Surat</p>
                      <p className="mt-1 font-bold text-slate-900">
                        {detailData.takah_code || "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-500">Tujuan</p>
                      <p className="mt-1 font-bold text-slate-900">
                        {detailData.tujuan_surat || "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-500">Perihal</p>
                      <p className="mt-1 font-bold text-slate-900">
                        {detailData.perihal || "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-500">Tanggal</p>
                      <p className="mt-1 font-bold text-slate-900">
                        {detailData.tanggal_surat || "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-500">Status Approval</p>
                      <span
                        className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                          selectedApproval.approval_status
                        )}`}
                      >
                        {getStatusLabel(selectedApproval.approval_status)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Catatan Approval
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows="5"
                    placeholder="Tulis catatan approval atau alasan reject..."
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-lg font-bold text-slate-900">
                  Preview Surat
                </h3>

                <div className="max-h-[620px] overflow-auto rounded-2xl border border-slate-200 bg-slate-100 p-5">
                  <div className="mx-auto max-w-3xl rounded-xl bg-white px-12 py-10 shadow-sm">
                    <div className="whitespace-pre-wrap font-serif text-[15px] leading-8 text-slate-950">
                      {detailData.generated_content ||
                        "Isi surat belum tersedia."}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 flex justify-end gap-3 border-t border-slate-200 bg-white px-7 py-5">
              <button
                onClick={closeDetail}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Batal
              </button>

              {selectedApproval.approval_status === "pending" && (
                <>
                  <button
                    onClick={() => handleDecision("rejected")}
                    className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-red-700"
                  >
                    <XCircle size={18} />
                    Reject
                  </button>

                  <button
                    onClick={() => handleDecision("approved")}
                    className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700"
                  >
                    <CheckCircle2 size={18} />
                    Approve
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Approval;