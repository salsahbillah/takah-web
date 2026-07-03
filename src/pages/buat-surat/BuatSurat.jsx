import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Edit,
  Eye,
  FileText,
  Plus,
  Save,
  Search,
  Send,
  X,
  XCircle,
} from "lucide-react";

import {
  createSuratKeluar,
  getAllSuratKeluar,
  getSuratKeluarById,
  submitSuratKeluarApproval,
  updateSuratKeluar,
} from "../../services/suratKeluarService";

import { getAllTemplateSurat } from "../../services/templateSuratService";
import { getAllParameterSurat } from "../../services/parameterSuratService";

const initialForm = {
  takah_id: "",
  template_id: "",
  tujuan_surat: "",
  perihal: "",
  lampiran: "",
  tanggal_surat: "",
  file_surat: "",
  parameter_values: {},
};

function BuatSurat() {
  const [suratList, setSuratList] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [parameters, setParameters] = useState([]);

  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("semua");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedSurat, setSelectedSurat] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);

      const suratResult = await getAllSuratKeluar();
      const templateResult = await getAllTemplateSurat();
      const parameterResult = await getAllParameterSurat();

      setSuratList(suratResult.data || []);
      setTemplates(templateResult.data || []);
      setParameters(parameterResult.data || []);
    } catch (error) {
      console.error(error);
      alert("Gagal mengambil data buat surat");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const selectedTemplate = templates.find(
    (item) => String(item.id) === String(form.template_id)
  );

  const selectedParameters = parameters.filter(
    (item) => String(item.template_id) === String(form.template_id)
  );

  const filteredSurat = useMemo(() => {
    return suratList.filter((item) => {
      const keyword = search.toLowerCase();

      const matchSearch =
        item.nomor_surat?.toLowerCase().includes(keyword) ||
        item.tujuan_surat?.toLowerCase().includes(keyword) ||
        item.perihal?.toLowerCase().includes(keyword) ||
        item.takah_code?.toLowerCase().includes(keyword);

      const matchStatus =
        statusFilter === "semua" || item.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [suratList, search, statusFilter]);

  const totalSurat = suratList.length;
  const totalDraft = suratList.filter((item) => item.status === "draft").length;
  const totalPending = suratList.filter(
    (item) => item.status === "pending"
  ).length;
  const totalApproved = suratList.filter(
    (item) => item.status === "approved"
  ).length;
  const totalRejected = suratList.filter(
    (item) => item.status === "rejected"
  ).length;

  const summaryCards = [
    {
      title: "Total Surat",
      value: totalSurat,
      icon: FileText,
      bgIcon: "bg-blue-100",
      textIcon: "text-blue-600",
    },
    {
      title: "Draft",
      value: totalDraft,
      icon: FileText,
      bgIcon: "bg-slate-100",
      textIcon: "text-slate-600",
    },
    {
      title: "Pending",
      value: totalPending,
      icon: Clock3,
      bgIcon: "bg-orange-100",
      textIcon: "text-orange-600",
    },
    {
      title: "Approved",
      value: totalApproved,
      icon: CheckCircle2,
      bgIcon: "bg-emerald-100",
      textIcon: "text-emerald-600",
    },
    {
      title: "Rejected",
      value: totalRejected,
      icon: XCircle,
      bgIcon: "bg-red-100",
      textIcon: "text-red-600",
    },
  ];

  const getStatusLabel = (status) => {
    if (status === "draft") return "Draft";
    if (status === "pending") return "Pending";
    if (status === "approved") return "Approved";
    if (status === "rejected") return "Rejected";
    return status || "-";
  };

  const getStatusClass = (status) => {
    if (status === "draft") return "bg-slate-100 text-slate-700";
    if (status === "pending") return "bg-orange-100 text-orange-700";
    if (status === "approved") return "bg-emerald-100 text-emerald-700";
    if (status === "rejected") return "bg-red-100 text-red-700";
    return "bg-slate-100 text-slate-700";
  };

  const openAddModal = () => {
    setEditId(null);
    setForm(initialForm);
    setShowModal(true);
  };

  const openEditModal = (item) => {
    if (item.status !== "draft") {
      alert("Surat hanya bisa diedit saat status masih draft");
      return;
    }

    setEditId(item.id);
    setForm({
      takah_id: item.takah_id || "",
      template_id: item.template_id || "",
      tujuan_surat: item.tujuan_surat || "",
      perihal: item.perihal || "",
      lampiran: item.lampiran || "",
      tanggal_surat: item.tanggal_surat || "",
      file_surat: item.file_surat || "",
      parameter_values: item.parameter_values || {},
    });
    setShowModal(true);
  };

  const openDetailModal = async (item) => {
    try {
      const result = await getSuratKeluarById(item.id);
      setSelectedSurat(result.data);
      setShowDetail(true);
    } catch (error) {
      console.error(error);
      alert("Gagal mengambil detail surat");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditId(null);
    setForm(initialForm);
  };

  const closeDetailModal = () => {
    setShowDetail(false);
    setSelectedSurat(null);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "template_id") {
      const template = templates.find((item) => String(item.id) === value);

      setForm((prev) => ({
        ...prev,
        template_id: value,
        takah_id: template?.takah_id || "",
        parameter_values: {},
      }));

      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleParameterChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      parameter_values: {
        ...prev.parameter_values,
        [key]: value,
      },
    }));
  };

  const validateForm = () => {
    if (
      !form.template_id ||
      !form.tujuan_surat ||
      !form.perihal ||
      !form.tanggal_surat
    ) {
      alert("Template, tujuan, perihal, dan tanggal surat wajib diisi");
      return false;
    }

    const emptyRequiredParameter = selectedParameters.find(
      (item) =>
        item.is_required && !form.parameter_values?.[item.parameter_key]
    );

    if (emptyRequiredParameter) {
      alert(`${emptyRequiredParameter.parameter_name} wajib diisi`);
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      setSaving(true);

      const payload = {
        takah_id: Number(form.takah_id),
        template_id: Number(form.template_id),
        tujuan_surat: form.tujuan_surat,
        perihal: form.perihal,
        lampiran: form.lampiran,
        tanggal_surat: form.tanggal_surat,
        file_surat: form.file_surat,
        parameter_values: form.parameter_values,
      };

      if (editId) {
        await updateSuratKeluar(editId, payload);
      } else {
        await createSuratKeluar(payload);
      }

      closeModal();
      fetchData();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Gagal menyimpan surat");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitApproval = async (id) => {
    const confirmSubmit = confirm("Ajukan surat ini untuk approval?");
    if (!confirmSubmit) return;

    try {
      await submitSuratKeluarApproval(id);
      alert("Surat berhasil diajukan ke approval");
      fetchData();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Gagal mengajukan approval");
    }
  };

  const renderParameterInput = (parameter) => {
    const value = form.parameter_values?.[parameter.parameter_key] || "";

    if (parameter.input_type === "textarea") {
      return (
        <textarea
          rows="4"
          value={value}
          onChange={(e) =>
            handleParameterChange(parameter.parameter_key, e.target.value)
          }
          className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-xs outline-none transition focus:border-blue-400"
        />
      );
    }

    return (
      <input
        type={parameter.input_type || "text"}
        value={value}
        onChange={(e) =>
          handleParameterChange(parameter.parameter_key, e.target.value)
        }
        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs outline-none transition focus:border-blue-400"
      />
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-4 text-[13px] lg:px-5 lg:py-5">
      <div className="mx-auto w-full max-w-[1180px]">
        <div className="mb-4 flex flex-col justify-between gap-4 rounded-2xl bg-gradient-to-r from-[#002248] to-[#2680BE] p-5 text-white shadow-md md:flex-row md:items-center">
          <div>
            <p className="text-xs text-white/75">Pengajuan Surat</p>
            <h1 className="mt-1 text-xl font-extrabold">Buat Surat</h1>
            <p className="mt-2 max-w-2xl text-xs leading-relaxed text-white/75">
              Buat surat berdasarkan template yang tersedia, isi parameter
              surat, lalu ajukan ke admin untuk proses approval.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="flex w-fit items-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-bold text-[#002248] shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-50"
          >
            <Plus size={16} />
            Buat Surat Baru
          </button>
        </div>

        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {summaryCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.bgIcon}`}
                >
                  <Icon className={card.textIcon} size={21} />
                </div>

                <p className="mt-4 text-xs font-semibold text-slate-500">
                  {card.title}
                </p>
                <h2 className="mt-1 text-2xl font-extrabold text-slate-900">
                  {card.value}
                </h2>
              </div>
            );
          })}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-col justify-between gap-3 xl:flex-row xl:items-center">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Riwayat Surat Saya
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Pantau surat yang dibuat, status approval, dan hasil review
                admin.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Cari surat..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs outline-none transition focus:border-blue-400 sm:w-72"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium text-slate-600 outline-none transition focus:border-blue-400"
              >
                <option value="semua">Semua Status</option>
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-100 shadow-sm">
            <table className="w-full min-w-[980px] border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
                  <th className="px-4 py-3 font-bold">No</th>
                  <th className="px-4 py-3 font-bold">Nomor Surat</th>
                  <th className="px-4 py-3 font-bold">Jenis</th>
                  <th className="px-4 py-3 font-bold">Tujuan</th>
                  <th className="px-4 py-3 font-bold">Perihal</th>
                  <th className="px-4 py-3 font-bold">Tanggal</th>
                  <th className="px-4 py-3 font-bold">Status</th>
                  <th className="px-4 py-3 text-right font-bold">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-8 text-center text-slate-500">
                      Memuat data surat...
                    </td>
                  </tr>
                ) : filteredSurat.length > 0 ? (
                  filteredSurat.map((item, index) => (
                    <tr
                      key={item.id}
                      className="border-b border-slate-100 text-slate-700 transition hover:bg-blue-50/40"
                    >
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3 font-bold text-slate-900">
                        {item.nomor_surat}
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-extrabold text-blue-700">
                          {item.takah_code}
                        </span>
                      </td>
                      <td className="px-4 py-3">{item.tujuan_surat}</td>
                      <td className="px-4 py-3">{item.perihal}</td>
                      <td className="px-4 py-3">{item.tanggal_surat}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-3 py-1 text-[11px] font-bold ${getStatusClass(
                            item.status
                          )}`}
                        >
                          {getStatusLabel(item.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openDetailModal(item)}
                            className="rounded-lg bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100"
                            title="Detail"
                          >
                            <Eye size={15} />
                          </button>

                          {item.status === "draft" && (
                            <>
                              <button
                                onClick={() => openEditModal(item)}
                                className="rounded-lg bg-yellow-50 p-2 text-yellow-600 transition hover:bg-yellow-100"
                                title="Edit Draft"
                              >
                                <Edit size={15} />
                              </button>

                              <button
                                onClick={() => handleSubmitApproval(item.id)}
                                className="rounded-lg bg-emerald-50 p-2 text-emerald-600 transition hover:bg-emerald-100"
                                title="Ajukan Approval"
                              >
                                <Send size={15} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-4 py-8 text-center text-slate-500">
                      Belum ada data surat.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between bg-gradient-to-r from-[#002248] to-[#2680BE] px-6 py-5 text-white">
              <div>
                <h2 className="text-lg font-extrabold">
                  {editId ? "Edit Draft Surat" : "Buat Surat Baru"}
                </h2>
                <p className="mt-1 text-xs text-white/70">
                  Pilih template, isi data surat, lalu simpan sebagai draft.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-full p-2 transition hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-bold text-slate-700">
                    Template Surat
                  </label>
                  <select
                    name="template_id"
                    value={form.template_id}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs outline-none focus:border-blue-400"
                  >
                    <option value="">Pilih template surat</option>
                    {templates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.takah_code} - {template.template_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold text-slate-700">
                    Tanggal Surat
                  </label>
                  <input
                    type="date"
                    name="tanggal_surat"
                    value={form.tanggal_surat}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold text-slate-700">
                  Tujuan Surat
                </label>
                <input
                  type="text"
                  name="tujuan_surat"
                  value={form.tujuan_surat}
                  onChange={handleChange}
                  placeholder="Contoh: Politeknik Negeri Indramayu"
                  required
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold text-slate-700">
                  Perihal
                </label>
                <input
                  type="text"
                  name="perihal"
                  value={form.perihal}
                  onChange={handleChange}
                  placeholder="Contoh: Undangan Review Progress Magang"
                  required
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold text-slate-700">
                  Lampiran
                </label>
                <input
                  type="text"
                  name="lampiran"
                  value={form.lampiran}
                  onChange={handleChange}
                  placeholder="Contoh: 1 Berkas / -"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs outline-none focus:border-blue-400"
                />
              </div>

              {form.template_id && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Parameter Surat
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Field ini mengikuti template surat yang dipilih.
                  </p>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {selectedParameters.map((parameter) => (
                      <div key={parameter.id}>
                        <label className="mb-2 block text-xs font-bold text-slate-700">
                          {parameter.parameter_name}{" "}
                          {parameter.is_required && (
                            <span className="text-red-500">*</span>
                          )}
                        </label>
                        {renderParameterInput(parameter)}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedTemplate && (
                <div className="rounded-2xl bg-blue-50 px-4 py-3 text-xs font-semibold leading-relaxed text-blue-700">
                  Surat akan dibuat otomatis dari template{" "}
                  <b>{selectedTemplate.template_name}</b> dan nomor surat akan
                  dibuat oleh sistem.
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-[#2680BE] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#1f6fa7] disabled:opacity-70"
                >
                  <Save size={15} />
                  {saving
                    ? "Menyimpan..."
                    : editId
                    ? "Simpan Perubahan"
                    : "Simpan Draft"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDetail && selectedSurat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between bg-gradient-to-r from-[#002248] to-[#2680BE] px-6 py-5 text-white">
              <div>
                <h2 className="text-lg font-extrabold">Detail Surat</h2>
                <p className="mt-1 text-xs text-white/70">
                  {selectedSurat.nomor_surat}
                </p>
              </div>

              <button
                onClick={closeDetailModal}
                className="rounded-full p-2 transition hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs text-slate-500">Nomor Surat</p>
                  <p className="mt-1 font-extrabold text-slate-900">
                    {selectedSurat.nomor_surat}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Status</p>
                  <span
                    className={`mt-1 inline-block rounded-full px-3 py-1 text-[11px] font-bold ${getStatusClass(
                      selectedSurat.status
                    )}`}
                  >
                    {getStatusLabel(selectedSurat.status)}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-100 p-5">
                <div className="mx-auto max-w-3xl rounded-xl bg-white px-10 py-8 shadow-sm">
                  <div className="whitespace-pre-wrap font-serif text-[15px] leading-8 text-slate-950">
                    {selectedSurat.generated_content ||
                      "Isi surat belum tersedia."}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={closeDetailModal}
                  className="rounded-xl bg-blue-600 px-5 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700"
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

export default BuatSurat;