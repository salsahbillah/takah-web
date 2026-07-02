import { useEffect, useMemo, useState } from "react";
import {
  Edit,
  Eye,
  FileText,
  Layers,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import { getAllTakah } from "../../services/takahService";
import {
  createTemplateSurat,
  deleteTemplateSurat,
  getAllTemplateSurat,
  updateTemplateSurat,
} from "../../services/templateSuratService";

const initialForm = {
  takah_id: "",
  template_name: "",
  content: "",
};

function TemplateSurat() {
  const [templates, setTemplates] = useState([]);
  const [takahList, setTakahList] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [searchQuery, setSearchQuery] = useState("");
  const [takahFilter, setTakahFilter] = useState("semua");
  const [showModal, setShowModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await getAllTemplateSurat();
      setTemplates(response.data || []);
    } catch (error) {
      console.error("Gagal mengambil template surat:", error);
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTakah = async () => {
    try {
      const response = await getAllTakah();
      setTakahList(response.data || []);
    } catch (error) {
      console.error("Gagal mengambil master takah:", error);
      setTakahList([]);
    }
  };

  useEffect(() => {
    fetchTemplates();
    fetchTakah();
  }, []);

  const filteredTemplates = useMemo(() => {
    return templates.filter((item) => {
      const search = searchQuery.toLowerCase();

      const matchSearch =
        item.template_name?.toLowerCase().includes(search) ||
        item.takah_code?.toLowerCase().includes(search) ||
        item.content?.toLowerCase().includes(search);

      const matchTakah =
        takahFilter === "semua" || item.takah_code === takahFilter;

      return matchSearch && matchTakah;
    });
  }, [templates, searchQuery, takahFilter]);

  const totalTemplate = templates.length;
  const totalJenisSurat = new Set(templates.map((item) => item.takah_code)).size;
  const totalContent = templates.filter((item) => item.content).length;
  const totalParameter = templates.reduce((total, item) => {
    const matches = item.content?.match(/{{(.*?)}}/g);
    return total + (matches ? matches.length : 0);
  }, 0);

  const summaryCards = [
    {
      title: "Total Template",
      value: totalTemplate,
      icon: FileText,
      bgIcon: "bg-blue-100",
      textIcon: "text-blue-600",
    },
    {
      title: "Jenis Surat",
      value: totalJenisSurat,
      icon: Layers,
      bgIcon: "bg-emerald-100",
      textIcon: "text-emerald-600",
    },
    {
      title: "Template Aktif",
      value: totalContent,
      icon: Eye,
      bgIcon: "bg-orange-100",
      textIcon: "text-orange-600",
    },
    {
      title: "Placeholder",
      value: totalParameter,
      icon: FileText,
      bgIcon: "bg-purple-100",
      textIcon: "text-purple-600",
    },
  ];

  const uniqueTakahCodes = [...new Set(templates.map((item) => item.takah_code))];

  const openAddModal = () => {
    setEditId(null);
    setForm(initialForm);
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditId(item.id);
    setForm({
      takah_id: item.takah_id,
      template_name: item.template_name,
      content: item.content,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditId(null);
    setForm(initialForm);
  };

  const openPreview = (item) => {
    setSelectedTemplate(item);
    setShowPreview(true);
  };

  const closePreview = () => {
    setSelectedTemplate(null);
    setShowPreview(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: name === "takah_id" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const payload = {
        takah_id: Number(form.takah_id),
        template_name: form.template_name,
        content: form.content,
      };

      if (editId) {
        await updateTemplateSurat(editId, payload);
      } else {
        await createTemplateSurat(payload);
      }

      closeModal();
      fetchTemplates();
    } catch (error) {
      console.error("Gagal menyimpan template surat:", error);
      alert("Gagal menyimpan template surat");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = confirm("Yakin ingin menghapus template surat ini?");

    if (!confirmDelete) return;

    try {
      await deleteTemplateSurat(id);
      fetchTemplates();
    } catch (error) {
      console.error("Gagal menghapus template surat:", error);
      alert("Gagal menghapus template surat");
    }
  };

  const getContentPreview = (content) => {
    if (!content) return "-";
    return content.length > 90 ? `${content.slice(0, 90)}...` : content;
  };

  const highlightPlaceholder = (content) => {
    if (!content) return "";

    return content.replace(/{{(.*?)}}/g, "[$1]");
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-4 text-[13px] lg:px-5 lg:py-5">
      <div className="mx-auto w-full max-w-[1180px]">
        <div className="mb-4 flex flex-col justify-between gap-4 rounded-2xl bg-gradient-to-r from-[#002248] to-[#2680BE] p-5 text-white shadow-md transition hover:shadow-lg md:flex-row md:items-center">
          <div>
            <p className="text-xs text-white/75">Template Surat</p>
            <h1 className="mt-1 text-xl font-extrabold">Template Surat</h1>
            <p className="mt-2 max-w-2xl text-xs leading-relaxed text-white/75">
              Kelola format isi surat berdasarkan jenis surat. Template ini
              dapat menggunakan placeholder seperti {"{{nama_tujuan}}"} dan
              {" {{tanggal}}"}.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="flex w-fit items-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-bold text-[#002248] shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-50 hover:shadow-md"
          >
            <Plus size={16} />
            Tambah Template
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
                Daftar Template Surat
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Template menjadi acuan isi surat yang akan digunakan pada proses
                pembuatan surat keluar.
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
                  placeholder="Cari template..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs outline-none transition hover:border-blue-300 focus:border-blue-400 sm:w-64"
                />
              </div>

              <select
                value={takahFilter}
                onChange={(event) => setTakahFilter(event.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium text-slate-600 outline-none transition hover:border-blue-300 focus:border-blue-400"
              >
                <option value="semua">Semua Jenis</option>
                {uniqueTakahCodes.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-100 shadow-sm">
            <table className="w-full min-w-[980px] border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
                  <th className="px-4 py-3 font-bold">Jenis Surat</th>
                  <th className="px-4 py-3 font-bold">Nama Template</th>
                  <th className="px-4 py-3 font-bold">Preview Isi</th>
                  <th className="px-4 py-3 font-bold">Dibuat</th>
                  <th className="px-4 py-3 text-right font-bold">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-4 py-8 text-center text-slate-500"
                    >
                      Memuat data template surat...
                    </td>
                  </tr>
                ) : filteredTemplates.length > 0 ? (
                  filteredTemplates.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-slate-100 text-slate-700 transition hover:bg-blue-50/40"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <FileText size={17} />
                          </div>

                          <span className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-extrabold text-blue-700">
                            {item.takah_code}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3 font-bold text-slate-900">
                        {item.template_name}
                      </td>

                      <td className="px-4 py-3 text-slate-500">
                        {getContentPreview(item.content)}
                      </td>

                      <td className="px-4 py-3 text-slate-500">
                        {item.created_at}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openPreview(item)}
                            className="rounded-lg bg-purple-50 p-2 text-purple-600 transition hover:bg-purple-100 hover:shadow-sm"
                            title="Preview"
                          >
                            <Eye size={15} />
                          </button>

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
                      colSpan="5"
                      className="px-4 py-8 text-center text-slate-500"
                    >
                      Data template surat tidak ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-xs text-slate-500">
            Menampilkan{" "}
            <span className="font-bold text-slate-700">
              {filteredTemplates.length}
            </span>{" "}
            dari{" "}
            <span className="font-bold text-slate-700">
              {templates.length}
            </span>{" "}
            data template.
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between bg-gradient-to-r from-[#002248] to-[#2680BE] px-5 py-4 text-white">
              <div>
                <h2 className="text-base font-extrabold">
                  {editId ? "Edit Template Surat" : "Tambah Template Surat"}
                </h2>
                <p className="mt-1 text-xs text-white/70">
                  Lengkapi data template surat.
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
                  Jenis Surat
                </label>
                <select
                  name="takah_id"
                  value={form.takah_id}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs outline-none transition hover:border-blue-300 focus:border-blue-400"
                >
                  <option value="">Pilih jenis surat</option>
                  {takahList.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.code || item.kode_takah} -{" "}
                      {item.name || item.nama_takah}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold text-slate-700">
                  Nama Template
                </label>
                <input
                  type="text"
                  name="template_name"
                  value={form.template_name}
                  onChange={handleChange}
                  placeholder="Contoh: Template Surat Undangan"
                  required
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs outline-none transition hover:border-blue-300 focus:border-blue-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold text-slate-700">
                  Isi Template
                </label>
                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  placeholder="Contoh: Dengan hormat, kami mengundang {{nama_tujuan}} untuk hadir pada {{tanggal}} di {{tempat}}."
                  required
                  rows="9"
                  className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-xs leading-relaxed outline-none transition hover:border-blue-300 focus:border-blue-400"
                />
                <p className="mt-2 text-[11px] text-slate-500">
                  Gunakan format placeholder seperti {"{{nama_tujuan}}"},{" "}
                  {"{{tanggal}}"}, atau {"{{tempat}}"}.
                </p>
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
                  {editId ? "Simpan Perubahan" : "Simpan Template"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPreview && selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between bg-gradient-to-r from-[#002248] to-[#2680BE] px-5 py-4 text-white">
              <div>
                <h2 className="text-base font-extrabold">
                  Preview Template Surat
                </h2>
                <p className="mt-1 text-xs text-white/70">
                  {selectedTemplate.template_name}
                </p>
              </div>

              <button
                type="button"
                onClick={closePreview}
                className="rounded-full p-2 transition hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5">
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                  {selectedTemplate.takah_code}
                </span>
                <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                  {selectedTemplate.created_at}
                </span>
              </div>

              <div className="max-h-[420px] overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-700 whitespace-pre-wrap">
                {highlightPlaceholder(selectedTemplate.content)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TemplateSurat;