import { getAllTemplateSurat } from "../../services/templateSuratService";
import { getAllParameterSurat } from "../../services/parameterSuratService";
import {
  getAllSuratKeluar,
  createSuratKeluar,
  updateSuratKeluar,
  deleteSuratKeluar,
  submitSuratKeluarApproval,
} from "../../services/suratKeluarService";
import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Save,
  FileText,
  Clock3,
  CheckCircle2,
  XCircle,
  Eye,
  Send,
} from "lucide-react";

const initialForm = {
  template_id: "",
  takah_id: "",
  tujuan_surat: "",
  perihal: "",
  lampiran: "",
  tanggal_surat: "",
  parameter_values: {},
};

function SuratKeluar() {
  const [suratKeluar, setSuratKeluar] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [parameters, setParameters] = useState([]);
  const [form, setForm] = useState(initialForm);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("semua");
  const [templateFilter, setTemplateFilter] = useState("semua");

  const [editId, setEditId] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchSuratKeluar = async () => {
    try {
      setLoading(true);
      const result = await getAllSuratKeluar();
      const data = Array.isArray(result) ? result : result.data || [];
      setSuratKeluar(data);
    } catch (error) {
      alert("Gagal mengambil data Surat Keluar");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const result = await getAllTemplateSurat();
      const data = Array.isArray(result) ? result : result.data || [];
      setTemplates(data);
    } catch (error) {
      alert("Gagal mengambil data Template Surat");
      console.error(error);
    }
  };

  const fetchParameters = async () => {
    try {
      const result = await getAllParameterSurat();
      const data = Array.isArray(result) ? result : result.data || [];
      setParameters(data);
    } catch (error) {
      alert("Gagal mengambil data Parameter Surat");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSuratKeluar();
    fetchTemplates();
    fetchParameters();
  }, []);

  const selectedTemplate = useMemo(() => {
    return templates.find(
      (template) => String(template.id) === String(form.template_id)
    );
  }, [templates, form.template_id]);

  const selectedParameters = useMemo(() => {
    if (!form.template_id) return [];

    return parameters.filter(
      (parameter) => String(parameter.template_id) === String(form.template_id)
    );
  }, [parameters, form.template_id]);

  const summary = useMemo(() => {
    return {
      total: suratKeluar.length,
      draft: suratKeluar.filter((item) => item.status === "draft").length,
      pending: suratKeluar.filter((item) => item.status === "pending").length,
      approved: suratKeluar.filter((item) => item.status === "approved").length,
      rejected: suratKeluar.filter((item) => item.status === "rejected").length,
    };
  }, [suratKeluar]);

  const filteredSuratKeluar = useMemo(() => {
    return suratKeluar.filter((item) => {
      const keyword = search.toLowerCase();

      const matchSearch =
        item.nomor_surat?.toLowerCase().includes(keyword) ||
        item.takah_code?.toLowerCase().includes(keyword) ||
        item.tujuan_surat?.toLowerCase().includes(keyword) ||
        item.perihal?.toLowerCase().includes(keyword) ||
        item.status?.toLowerCase().includes(keyword);

      const matchStatus =
        statusFilter === "semua" || item.status === statusFilter;

      const matchTemplate =
        templateFilter === "semua" ||
        String(item.takah_id) === String(templateFilter);

      return matchSearch && matchStatus && matchTemplate;
    });
  }, [suratKeluar, search, statusFilter, templateFilter]);

  const handleOpenAddModal = () => {
    setForm(initialForm);
    setEditId(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setForm(initialForm);
    setEditId(null);
    setShowModal(false);
  };

  const handleCloseDetail = () => {
    setDetailData(null);
    setShowDetail(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

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

  const handleEdit = (item) => {
    setEditId(item.id);

    const template = templates.find(
      (templateItem) =>
        String(templateItem.takah_id) === String(item.takah_id)
    );

    setForm({
      template_id: template?.id || "",
      takah_id: item.takah_id || "",
      tujuan_surat: item.tujuan_surat || "",
      perihal: item.perihal || "",
      lampiran: item.lampiran || "",
      tanggal_surat: item.tanggal_surat || "",
      parameter_values: {},
    });

    setShowModal(true);
  };

  const handleDetail = (item) => {
    setDetailData(item);
    setShowDetail(true);
  };

  const validateDynamicParameter = () => {
    for (const parameter of selectedParameters) {
      if (
        parameter.is_required &&
        !form.parameter_values[parameter.parameter_key]
      ) {
        alert(`${parameter.parameter_name} wajib diisi`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.template_id ||
      !form.takah_id ||
      !form.tujuan_surat ||
      !form.perihal ||
      !form.tanggal_surat
    ) {
      alert("Template, tujuan, perihal, dan tanggal surat wajib diisi");
      return;
    }

    if (!validateDynamicParameter()) return;

    const payload = {
      template_id: Number(form.template_id),
      takah_id: Number(form.takah_id),
      tujuan_surat: form.tujuan_surat,
      perihal: form.perihal,
      lampiran: form.lampiran || "-",
      tanggal_surat: form.tanggal_surat,
      file_surat: "",
      parameter_values: form.parameter_values,
    };

    try {
      setSaving(true);

      if (editId) {
        await updateSuratKeluar(editId, payload);
        alert("Surat keluar berhasil diperbarui");
      } else {
        await createSuratKeluar(payload);
        alert("Surat keluar berhasil dibuat");
      }

      handleCloseModal();
      fetchSuratKeluar();
    } catch (error) {
      alert(
        error.response?.data?.message || "Gagal menyimpan data Surat Keluar"
      );
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = confirm("Yakin ingin menghapus surat keluar ini?");
    if (!confirmDelete) return;

    try {
      await deleteSuratKeluar(id);
      alert("Surat keluar berhasil dihapus");
      fetchSuratKeluar();
    } catch (error) {
      alert(error.response?.data?.message || "Gagal menghapus Surat Keluar");
      console.error(error);
    }
  };

  const handleSubmitApproval = async (id) => {
    try {
      await submitSuratKeluarApproval(id);
      alert("Surat berhasil diajukan ke approval");
      fetchSuratKeluar();
    } catch (error) {
      alert(error.response?.data?.message || "Gagal mengajukan approval");
    }
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

  const renderParameterInput = (parameter) => {
    const value = form.parameter_values[parameter.parameter_key] || "";

    if (parameter.input_type === "textarea") {
      return (
        <textarea
          rows="3"
          value={value}
          onChange={(e) =>
            handleParameterChange(parameter.parameter_key, e.target.value)
          }
          placeholder={`Masukkan ${parameter.parameter_name.toLowerCase()}`}
          className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
        placeholder={`Masukkan ${parameter.parameter_name.toLowerCase()}`}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    );
  };

  const summaryCards = [
    {
      title: "Total Surat Keluar",
      value: summary.total,
      icon: FileText,
      bgIcon: "bg-blue-100",
      textIcon: "text-blue-600",
    },
    {
      title: "Draft",
      value: summary.draft,
      icon: FileText,
      bgIcon: "bg-slate-100",
      textIcon: "text-slate-600",
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
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-100">Data Surat</p>

            <h1 className="mt-1 text-4xl font-bold text-white">
              Surat Keluar
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-blue-100">
              Buat surat keluar berdasarkan Template Surat, Parameter Surat, dan
              Config Nomor Surat.
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-bold text-[#0f5f99] shadow-sm transition hover:scale-[1.02] lg:w-auto"
          >
            <Plus size={18} />
            Tambah Surat
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
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
              Daftar Surat Keluar
            </h2>
            <p className="text-sm text-slate-500">
              Data surat yang sudah dibuat dan tersimpan sebagai draft, pending,
              approved, rejected, atau completed.
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
                placeholder="Cari nomor, tujuan, atau perihal..."
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <select
              value={templateFilter}
              onChange={(e) => setTemplateFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="semua">Semua Jenis</option>
              {templates.map((template) => (
                <option key={template.id} value={template.takah_id}>
                  {template.takah_code} - {template.template_name}
                </option>
              ))}
            </select>

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
          <table className="w-full min-w-250 border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-sm text-slate-600">
                <th className="px-4 py-4 font-semibold">No</th>
                <th className="px-4 py-4 font-semibold">Nomor Surat</th>
                <th className="px-4 py-4 font-semibold">Jenis</th>
                <th className="px-4 py-4 font-semibold">Tujuan</th>
                <th className="px-4 py-4 font-semibold">Perihal</th>
                <th className="px-4 py-4 font-semibold">Tanggal</th>
                <th className="px-4 py-4 font-semibold">Status</th>
                <th className="px-4 py-4 text-center font-semibold">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-4 py-10 text-center text-sm text-slate-500"
                  >
                    Memuat data Surat Keluar...
                  </td>
                </tr>
              ) : filteredSuratKeluar.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-4 py-10 text-center text-sm text-slate-500"
                  >
                    Belum ada data Surat Keluar.
                  </td>
                </tr>
              ) : (
                filteredSuratKeluar.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-b border-slate-100 text-sm text-slate-700 transition hover:bg-slate-50"
                  >
                    <td className="px-4 py-4">{index + 1}</td>

                    <td className="px-4 py-4 font-bold text-slate-900">
                      {item.nomor_surat || "-"}
                    </td>

                    <td className="px-4 py-4">
                      <span className="rounded-lg bg-blue-50 px-3 py-1 font-bold text-blue-700">
                        {item.takah_code || "-"}
                      </span>
                    </td>

                    <td className="px-4 py-4">{item.tujuan_surat || "-"}</td>

                    <td className="px-4 py-4">{item.perihal || "-"}</td>

                    <td className="px-4 py-4">{item.tanggal_surat || "-"}</td>

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
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleDetail(item)}
                          className="rounded-lg bg-blue-100 p-2 text-blue-700 transition hover:bg-blue-200"
                          title="Detail"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                        onClick={() => handleEdit(item)}
                        className="rounded-lg bg-amber-100 p-2 text-amber-700 transition hover:bg-amber-200"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>

                      {item.status === "draft" && (
                        <button
                          onClick={() => handleSubmitApproval(item.id)}
                          className="rounded-lg bg-emerald-100 p-2 text-emerald-700 transition hover:bg-emerald-200"
                          title="Ajukan Approval"
                        >
                          <Send size={16} />
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="rounded-lg bg-red-100 p-2 text-red-700 transition hover:bg-red-200"
                        title="Hapus"
                      >
                        <Trash2 size={16} />
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editId ? "Edit Surat Keluar" : "Tambah Surat Keluar"}
                </h2>
                <p className="text-sm text-slate-500">
                  Pilih template surat, lalu isi parameter sesuai kebutuhan
                  surat.
                </p>
              </div>

              <button
                onClick={handleCloseModal}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 px-6 py-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Template Surat
                  </label>
                  <select
                    name="template_id"
                    value={form.template_id}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Tanggal Surat
                  </label>
                  <input
                    type="date"
                    name="tanggal_surat"
                    value={form.tanggal_surat}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {selectedTemplate && (
                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">
                  Template dipilih:{" "}
                  <span className="font-bold">
                    {selectedTemplate.template_name}
                  </span>{" "}
                  ({selectedTemplate.takah_code})
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Tujuan Surat
                  </label>
                  <input
                    type="text"
                    name="tujuan_surat"
                    value={form.tujuan_surat}
                    onChange={handleChange}
                    placeholder="Contoh: Politeknik Negeri Indramayu"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Lampiran
                  </label>
                  <input
                    type="text"
                    name="lampiran"
                    value={form.lampiran}
                    onChange={handleChange}
                    placeholder="Contoh: 1 Berkas / -"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Perihal
                </label>
                <input
                  type="text"
                  name="perihal"
                  value={form.perihal}
                  onChange={handleChange}
                  placeholder="Contoh: Undangan Review Magang"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-base font-bold text-slate-900">
                  Parameter Surat
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Field di bawah ini otomatis mengikuti template surat yang
                  dipilih.
                </p>

                {!form.template_id ? (
                  <div className="mt-4 rounded-xl bg-white px-4 py-6 text-center text-sm text-slate-500">
                    Pilih template surat terlebih dahulu.
                  </div>
                ) : selectedParameters.length === 0 ? (
                  <div className="mt-4 rounded-xl bg-white px-4 py-6 text-center text-sm text-slate-500">
                    Belum ada parameter untuk template ini.
                  </div>
                ) : (
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {selectedParameters.map((parameter) => (
                      <div
                        key={parameter.id}
                        className={
                          parameter.input_type === "textarea"
                            ? "md:col-span-2"
                            : ""
                        }
                      >
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          {parameter.parameter_name}
                          {parameter.is_required && (
                            <span className="ml-1 text-red-500">*</span>
                          )}
                        </label>

                        {renderParameterInput(parameter)}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700">
                File surat tidak diupload manual. Surat akan dibuat otomatis
                dari Template Surat, Parameter Surat, dan Config Nomor Surat.
              </div>

              <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save size={18} />
                  {saving
                    ? "Menyimpan..."
                    : editId
                    ? "Simpan Perubahan"
                    : "Buat Surat"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDetail && detailData && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
    <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-7 py-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Detail Surat Keluar
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Preview dokumen dan informasi surat.
          </p>
        </div>

        <button
          onClick={handleCloseDetail}
          className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100"
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
                <p className="text-slate-500">Template</p>
                <p className="mt-1 font-bold text-slate-900">
                  {detailData.template_name || "-"}
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
                <p className="text-slate-500">Lampiran</p>
                <p className="mt-1 font-bold text-slate-900">
                  {detailData.lampiran || "-"}
                </p>
              </div>

              <div>
                <p className="text-slate-500">Status</p>
                <span
                  className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                    detailData.status
                  )}`}
                >
                  {getStatusLabel(detailData.status)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Preview Surat
              </h3>
              <p className="text-sm text-slate-500">
                Isi surat hasil generate dari template dan parameter.
              </p>
            </div>
          </div>

          <div className="max-h-[620px] overflow-auto rounded-2xl border border-slate-200 bg-slate-100 p-5">
            <div className="mx-auto max-w-3xl rounded-xl bg-white px-12 py-10 shadow-sm">
              <div className="whitespace-pre-wrap font-serif text-[15px] leading-8 text-slate-950">
                {detailData.generated_content || "Isi surat belum tersedia."}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 flex justify-end gap-3 border-t border-slate-200 bg-white px-7 py-5">
        <button
          onClick={handleCloseDetail}
          className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          Tutup
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default SuratKeluar;