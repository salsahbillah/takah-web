import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Edit,
  FileText,
  Layers,
  Plus,
  Search,
  Settings2,
  Trash2,
  X,
  XCircle,
} from "lucide-react";

import { getAllTemplateSurat } from "../../services/templateSuratService";
import {
  createParameterSurat,
  deleteParameterSurat,
  getAllParameterSurat,
  updateParameterSurat,
} from "../../services/parameterSuratService";

const initialForm = {
  template_id: "",
  parameter_name: "",
  parameter_key: "",
  input_type: "text",
  is_required: true,
};

function ParameterSurat() {
  const [parameters, setParameters] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [form, setForm] = useState(initialForm);

  const [searchQuery, setSearchQuery] = useState("");
  const [templateFilter, setTemplateFilter] = useState("semua");
  const [requiredFilter, setRequiredFilter] = useState("semua");

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchParameters = async () => {
    try {
      setLoading(true);
      const response = await getAllParameterSurat();
      setParameters(response.data || []);
    } catch (error) {
      console.error("Gagal mengambil data parameter surat:", error);
      setParameters([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await getAllTemplateSurat();
      setTemplates(response.data || []);
    } catch (error) {
      console.error("Gagal mengambil data template surat:", error);
      setTemplates([]);
    }
  };

  useEffect(() => {
    fetchParameters();
    fetchTemplates();
  }, []);

  const filteredData = useMemo(() => {
    return parameters.filter((item) => {
      const search = searchQuery.toLowerCase();

      const matchSearch =
        item.template_name?.toLowerCase().includes(search) ||
        item.parameter_name?.toLowerCase().includes(search) ||
        item.parameter_key?.toLowerCase().includes(search) ||
        item.input_type?.toLowerCase().includes(search);

      const matchTemplate =
        templateFilter === "semua" ||
        String(item.template_id) === String(templateFilter);

      const matchRequired =
        requiredFilter === "semua" ||
        (requiredFilter === "wajib" && item.is_required) ||
        (requiredFilter === "opsional" && !item.is_required);

      return matchSearch && matchTemplate && matchRequired;
    });
  }, [parameters, searchQuery, templateFilter, requiredFilter]);

  const totalParameter = parameters.length;
  const totalRequired = parameters.filter((item) => item.is_required).length;
  const totalOptional = parameters.filter((item) => !item.is_required).length;
  const totalTemplate = new Set(parameters.map((item) => item.template_id)).size;

  const summaryCards = [
    {
      title: "Total Parameter",
      value: totalParameter,
      icon: Settings2,
      bgIcon: "bg-blue-100",
      textIcon: "text-blue-600",
    },
    {
      title: "Wajib Diisi",
      value: totalRequired,
      icon: CheckCircle2,
      bgIcon: "bg-emerald-100",
      textIcon: "text-emerald-600",
    },
    {
      title: "Opsional",
      value: totalOptional,
      icon: XCircle,
      bgIcon: "bg-orange-100",
      textIcon: "text-orange-600",
    },
    {
      title: "Template Terkait",
      value: totalTemplate,
      icon: Layers,
      bgIcon: "bg-purple-100",
      textIcon: "text-purple-600",
    },
  ];

  const getInputTypeBadge = (type) => {
    const styles = {
      text: "bg-blue-100 text-blue-700",
      date: "bg-emerald-100 text-emerald-700",
      number: "bg-purple-100 text-purple-700",
      textarea: "bg-orange-100 text-orange-700",
      time: "bg-pink-100 text-pink-700",
      email: "bg-cyan-100 text-cyan-700",
    };

    return styles[type] || "bg-slate-100 text-slate-700";
  };

  const openAddModal = () => {
    setEditId(null);
    setForm(initialForm);
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditId(item.id);
    setForm({
      template_id: item.template_id,
      parameter_name: item.parameter_name,
      parameter_key: item.parameter_key,
      input_type: item.input_type,
      is_required: item.is_required,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditId(null);
    setForm(initialForm);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]:
        name === "template_id"
          ? Number(value)
          : name === "is_required"
          ? value === "true"
          : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const payload = {
        template_id: Number(form.template_id),
        parameter_name: form.parameter_name,
        parameter_key: form.parameter_key,
        input_type: form.input_type,
        is_required: Boolean(form.is_required),
      };

      if (editId) {
        await updateParameterSurat(editId, payload);
      } else {
        await createParameterSurat(payload);
      }

      closeModal();
      fetchParameters();
    } catch (error) {
      console.error("Gagal menyimpan parameter surat:", error);
      alert("Gagal menyimpan parameter surat");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = confirm(
      "Yakin ingin menghapus parameter surat ini?"
    );

    if (!confirmDelete) return;

    try {
      await deleteParameterSurat(id);
      fetchParameters();
    } catch (error) {
      console.error("Gagal menghapus parameter surat:", error);
      alert("Gagal menghapus parameter surat");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-4 text-[13px] lg:px-5 lg:py-5">
      <div className="mx-auto w-full max-w-[1180px]">
        <div className="mb-4 flex flex-col justify-between gap-4 rounded-2xl bg-gradient-to-r from-[#002248] to-[#2680BE] p-5 text-white shadow-md transition hover:shadow-lg md:flex-row md:items-center">
          <div>
            <p className="text-xs text-white/75">Data Template Surat</p>
            <h1 className="mt-1 text-xl font-extrabold">Parameter Surat</h1>
            <p className="mt-2 max-w-2xl text-xs leading-relaxed text-white/75">
              Kelola field dinamis yang akan digunakan pada template surat,
              seperti nama tujuan, tanggal, tempat, jabatan, dan kebutuhan
              input lainnya.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="flex w-fit items-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-bold text-[#002248] shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-50 hover:shadow-md"
          >
            <Plus size={16} />
            Tambah Parameter
          </button>
        </div>

        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="mb-4 flex flex-col justify-between gap-3 xl:flex-row xl:items-center">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Daftar Parameter Surat
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Parameter digunakan sebagai field input saat user membuat surat
                berdasarkan template tertentu.
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
                  placeholder="Cari parameter..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs outline-none transition hover:border-blue-300 focus:border-blue-400 sm:w-64"
                />
              </div>

              <select
                value={templateFilter}
                onChange={(event) => setTemplateFilter(event.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium text-slate-600 outline-none transition hover:border-blue-300 focus:border-blue-400"
              >
                <option value="semua">Semua Template</option>
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.template_name}
                  </option>
                ))}
              </select>

              <select
                value={requiredFilter}
                onChange={(event) => setRequiredFilter(event.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium text-slate-600 outline-none transition hover:border-blue-300 focus:border-blue-400"
              >
                <option value="semua">Semua Status</option>
                <option value="wajib">Wajib</option>
                <option value="opsional">Opsional</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-100 shadow-sm">
            <table className="w-full min-w-[950px] border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
                  <th className="px-4 py-3 font-bold">Template</th>
                  <th className="px-4 py-3 font-bold">Nama Parameter</th>
                  <th className="px-4 py-3 font-bold">Key Parameter</th>
                  <th className="px-4 py-3 font-bold">Tipe Input</th>
                  <th className="px-4 py-3 font-bold">Status</th>
                  <th className="px-4 py-3 font-bold">Dibuat</th>
                  <th className="px-4 py-3 text-right font-bold">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-4 py-8 text-center text-slate-500"
                    >
                      Memuat data parameter surat...
                    </td>
                  </tr>
                ) : filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-slate-100 text-slate-700 transition hover:bg-blue-50/40"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <FileText size={17} />
                          </div>
                          <span className="font-bold text-slate-800">
                            {item.template_name}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3 font-semibold text-slate-800">
                        {item.parameter_name}
                      </td>

                      <td className="px-4 py-3">
                        <span className="rounded-lg bg-slate-100 px-3 py-1 font-mono text-[11px] font-bold text-slate-700">
                          {item.parameter_key}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-3 py-1 text-[11px] font-bold capitalize ${getInputTypeBadge(
                            item.input_type
                          )}`}
                        >
                          {item.input_type}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                            item.is_required
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {item.is_required ? "Wajib" : "Opsional"}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-slate-500">
                        {item.created_at}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(item)}
                            className="rounded-lg bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100 hover:shadow-sm"
                            title="Edit"
                          >
                            <Edit size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100 hover:shadow-sm"
                            title="Hapus"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-4 py-8 text-center text-slate-500"
                    >
                      Data parameter surat tidak ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-xs text-slate-500">
            Menampilkan{" "}
            <span className="font-bold text-slate-700">
              {filteredData.length}
            </span>{" "}
            dari{" "}
            <span className="font-bold text-slate-700">
              {parameters.length}
            </span>{" "}
            data parameter.
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between bg-gradient-to-r from-[#002248] to-[#2680BE] px-5 py-4 text-white">
              <div>
                <h2 className="text-base font-extrabold">
                  {editId ? "Edit Parameter Surat" : "Tambah Parameter Surat"}
                </h2>
                <p className="mt-1 text-xs text-white/70">
                  Lengkapi data parameter untuk template surat.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-full p-2 transition hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-5">
              <div>
                <label className="mb-2 block text-xs font-bold text-slate-700">
                  Template Surat
                </label>
                <select
                  name="template_id"
                  value={form.template_id}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs outline-none transition hover:border-blue-300 focus:border-blue-400"
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
                  Nama Parameter
                </label>
                <input
                  type="text"
                  name="parameter_name"
                  value={form.parameter_name}
                  onChange={handleChange}
                  placeholder="Contoh: Nama Tujuan"
                  required
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs outline-none transition hover:border-blue-300 focus:border-blue-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold text-slate-700">
                  Key Parameter
                </label>
                <input
                  type="text"
                  name="parameter_key"
                  value={form.parameter_key}
                  onChange={handleChange}
                  placeholder="Contoh: nama_tujuan"
                  required
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-mono outline-none transition hover:border-blue-300 focus:border-blue-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold text-slate-700">
                  Tipe Input
                </label>
                <select
                  name="input_type"
                  value={form.input_type}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs outline-none transition hover:border-blue-300 focus:border-blue-400"
                >
                  <option value="text">Text</option>
                  <option value="textarea">Textarea</option>
                  <option value="number">Number</option>
                  <option value="date">Date</option>
                  <option value="time">Time</option>
                  <option value="email">Email</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold text-slate-700">
                  Status Isian
                </label>
                <select
                  name="is_required"
                  value={String(form.is_required)}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs outline-none transition hover:border-blue-300 focus:border-blue-400"
                >
                  <option value="true">Wajib Diisi</option>
                  <option value="false">Opsional</option>
                </select>
              </div>

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
                  className="rounded-xl bg-[#2680BE] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#1f6fa7] hover:shadow-md"
                >
                  {editId ? "Simpan Perubahan" : "Simpan Parameter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ParameterSurat;