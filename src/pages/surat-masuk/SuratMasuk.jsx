import { useEffect, useMemo, useState } from "react";
import {
  Archive,
  Download,
  Edit,
  Eye,
  FileText,
  Inbox,
  Mail,
  Plus,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import {
  createSuratMasuk,
  deleteSuratMasuk,
  getAllSuratMasuk,
  updateSuratMasuk,
} from "../../services/suratMasukService";

const API_URL = "http://localhost:8080";

const initialForm = {
  nomor_surat: "",
  pengirim: "",
  penerima: "",
  perihal: "",
  file_surat: null,
  tanggal_surat: "",
  keterangan: "",
};

function SuratMasuk() {
  const [suratMasuk, setSuratMasuk] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [fileName, setFileName] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("semua");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedSurat, setSelectedSurat] = useState(null);
  const [editId, setEditId] = useState(null);

  const getFileUrl = (filePath) => {
    if (!filePath) return "";
    if (filePath.startsWith("http")) return filePath;
    return `${API_URL}${filePath}`;
  };

  const getOriginalFileName = (filePath) => {
    if (!filePath) return "-";
    return filePath.split("/").pop();
  };

  const fetchSuratMasuk = async () => {
    try {
      setLoading(true);
      const response = await getAllSuratMasuk();
      setSuratMasuk(response.data || []);
    } catch (error) {
      console.error("Gagal mengambil surat masuk:", error);
      setSuratMasuk([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuratMasuk();
  }, []);

  const filteredData = useMemo(() => {
    return suratMasuk.filter((item) => {
      const search = searchQuery.toLowerCase();

      const matchSearch =
        item.nomor_surat?.toLowerCase().includes(search) ||
        item.pengirim?.toLowerCase().includes(search) ||
        item.penerima?.toLowerCase().includes(search) ||
        item.perihal?.toLowerCase().includes(search) ||
        item.status?.toLowerCase().includes(search);

      const matchStatus =
        statusFilter === "semua" || item.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [suratMasuk, searchQuery, statusFilter]);

  const totalSurat = suratMasuk.length;
  const totalReceived = suratMasuk.filter(
    (item) => item.status === "received"
  ).length;
  const totalProcessed = suratMasuk.filter(
    (item) => item.status === "processed"
  ).length;
  const totalArchived = suratMasuk.filter(
    (item) => item.status === "archived"
  ).length;

  const summaryCards = [
    {
      title: "Total Surat Masuk",
      value: totalSurat,
      icon: Inbox,
      bgIcon: "bg-blue-100",
      textIcon: "text-blue-600",
    },
    {
      title: "Diterima",
      value: totalReceived,
      icon: Mail,
      bgIcon: "bg-emerald-100",
      textIcon: "text-emerald-600",
    },
    {
      title: "Diproses",
      value: totalProcessed,
      icon: FileText,
      bgIcon: "bg-orange-100",
      textIcon: "text-orange-600",
    },
    {
      title: "Diarsipkan",
      value: totalArchived,
      icon: Archive,
      bgIcon: "bg-purple-100",
      textIcon: "text-purple-600",
    },
  ];

  const openAddModal = () => {
    setEditId(null);
    setForm(initialForm);
    setFileName("");
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditId(item.id);
    setForm({
      nomor_surat: item.nomor_surat || "",
      pengirim: item.pengirim || "",
      penerima: item.penerima || "",
      perihal: item.perihal || "",
      file_surat: null,
      tanggal_surat: item.tanggal_surat || "",
      keterangan: item.keterangan || "",
    });
    setFileName(item.file_surat ? getOriginalFileName(item.file_surat) : "");
    setShowModal(true);
  };

  const openDetailModal = (item) => {
    setSelectedSurat(item);
    setShowDetail(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditId(null);
    setForm(initialForm);
    setFileName("");
  };

  const closeDetailModal = () => {
    setShowDetail(false);
    setSelectedSurat(null);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      setForm((prevForm) => ({
        ...prevForm,
        file_surat: null,
      }));
      setFileName("");
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const allowedExtensions = [".pdf", ".doc", ".docx"];
    const fileExtension = file.name
      .slice(file.name.lastIndexOf("."))
      .toLowerCase();

    if (
      !allowedTypes.includes(file.type) &&
      !allowedExtensions.includes(fileExtension)
    ) {
      alert("File harus berformat PDF, DOC, atau DOCX.");
      event.target.value = "";
      return;
    }

    setForm((prevForm) => ({
      ...prevForm,
      file_surat: file,
    }));
    setFileName(file.name);
  };

  const buildFormData = () => {
    const formData = new FormData();

    formData.append("nomor_surat", form.nomor_surat);
    formData.append("pengirim", form.pengirim);
    formData.append("penerima", form.penerima);
    formData.append("perihal", form.perihal);
    formData.append("tanggal_surat", form.tanggal_surat);
    formData.append("keterangan", form.keterangan);

    if (form.file_surat) {
      formData.append("file_surat", form.file_surat);
    }

    return formData;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);

      const payload = buildFormData();

      if (editId) {
        await updateSuratMasuk(editId, payload);
      } else {
        await createSuratMasuk(payload);
      }

      closeModal();
      fetchSuratMasuk();
    } catch (error) {
      console.error("Gagal menyimpan surat masuk:", error);
      alert(error.response?.data?.message || "Gagal menyimpan surat masuk");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = confirm("Yakin ingin menghapus surat masuk ini?");

    if (!confirmDelete) return;

    try {
      await deleteSuratMasuk(id);
      fetchSuratMasuk();
    } catch (error) {
      console.error("Gagal menghapus surat masuk:", error);
      alert(error.response?.data?.message || "Gagal menghapus surat masuk");
    }
  };

  const getStatusLabel = (status) => {
    if (status === "received") return "Diterima";
    if (status === "processed") return "Diproses";
    if (status === "archived") return "Diarsipkan";
    return status || "-";
  };

  const getStatusClass = (status) => {
    if (status === "received") return "bg-emerald-100 text-emerald-700";
    if (status === "processed") return "bg-orange-100 text-orange-700";
    if (status === "archived") return "bg-purple-100 text-purple-700";
    return "bg-slate-100 text-slate-700";
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-4 text-[13px] lg:px-5 lg:py-5">
      <div className="mx-auto w-full max-w-[1180px]">
        <div className="mb-4 flex flex-col justify-between gap-4 rounded-2xl bg-gradient-to-r from-[#002248] to-[#2680BE] p-5 text-white shadow-md transition hover:shadow-lg md:flex-row md:items-center">
          <div>
            <p className="text-xs text-white/75">Administrasi Surat</p>
            <h1 className="mt-1 text-xl font-extrabold">Surat Masuk</h1>
            <p className="mt-2 max-w-2xl text-xs leading-relaxed text-white/75">
              Kelola data surat yang diterima dari pihak luar, mulai dari nomor
              surat, pengirim, penerima, perihal, tanggal, lampiran, hingga
              keterangan surat.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="flex w-fit items-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-bold text-[#002248] shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-50 hover:shadow-md"
          >
            <Plus size={16} />
            Tambah Surat Masuk
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
                Daftar Surat Masuk
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Surat masuk dicatat oleh admin sebagai arsip surat yang diterima
                oleh perusahaan.
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
                  placeholder="Cari surat masuk..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs outline-none transition hover:border-blue-300 focus:border-blue-400 sm:w-64"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-medium text-slate-600 outline-none transition hover:border-blue-300 focus:border-blue-400"
              >
                <option value="semua">Semua Status</option>
                <option value="received">Diterima</option>
                <option value="processed">Diproses</option>
                <option value="archived">Diarsipkan</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-100 shadow-sm">
            <table className="w-full min-w-[1050px] border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
                  <th className="px-4 py-3 font-bold">Nomor Surat</th>
                  <th className="px-4 py-3 font-bold">Pengirim</th>
                  <th className="px-4 py-3 font-bold">Penerima</th>
                  <th className="px-4 py-3 font-bold">Perihal</th>
                  <th className="px-4 py-3 font-bold">Tanggal</th>
                  <th className="px-4 py-3 font-bold">Status</th>
                  <th className="px-4 py-3 font-bold">Lampiran</th>
                  <th className="px-4 py-3 text-right font-bold">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-4 py-8 text-center text-slate-500"
                    >
                      Memuat data surat masuk...
                    </td>
                  </tr>
                ) : filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-slate-100 text-slate-700 transition hover:bg-blue-50/40"
                    >
                      <td className="px-4 py-3">
                        <span className="rounded-lg bg-blue-50 px-3 py-1 font-mono text-[11px] font-bold text-blue-700">
                          {item.nomor_surat}
                        </span>
                      </td>

                      <td className="px-4 py-3 font-semibold text-slate-800">
                        {item.pengirim}
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {item.penerima}
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {item.perihal}
                      </td>

                      <td className="px-4 py-3 text-slate-500">
                        {item.tanggal_surat}
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

                      <td className="px-4 py-3">
                        {item.file_surat ? (
                          <a
                            href={getFileUrl(item.file_surat)}
                            target="_blank"
                            rel="noreferrer"
                            className="flex w-fit items-center gap-2 rounded-lg bg-blue-50 px-3 py-1 font-semibold text-blue-700 transition hover:bg-blue-100"
                          >
                            <Download size={14} />
                            Lihat File
                          </a>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openDetailModal(item)}
                            className="rounded-lg bg-purple-50 p-2 text-purple-600 transition hover:bg-purple-100 hover:shadow-sm"
                            title="Detail"
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
                      colSpan="8"
                      className="px-4 py-8 text-center text-slate-500"
                    >
                      Data surat masuk tidak ditemukan.
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
              {suratMasuk.length}
            </span>{" "}
            data surat masuk.
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between bg-gradient-to-r from-[#002248] to-[#2680BE] px-5 py-4 text-white">
              <div>
                <h2 className="text-base font-extrabold">
                  {editId ? "Edit Surat Masuk" : "Tambah Surat Masuk"}
                </h2>
                <p className="mt-1 text-xs text-white/70">
                  Lengkapi data surat masuk yang diterima.
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
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-bold text-slate-700">
                    Nomor Surat
                  </label>
                  <input
                    type="text"
                    name="nomor_surat"
                    value={form.nomor_surat}
                    onChange={handleChange}
                    placeholder="Contoh: 002/EXT/VI/2026"
                    required
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs outline-none transition hover:border-blue-300 focus:border-blue-400"
                  />
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
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs outline-none transition hover:border-blue-300 focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold text-slate-700">
                    Pengirim
                  </label>
                  <input
                    type="text"
                    name="pengirim"
                    value={form.pengirim}
                    onChange={handleChange}
                    placeholder="Contoh: PT Contoh Indonesia"
                    required
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs outline-none transition hover:border-blue-300 focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold text-slate-700">
                    Penerima
                  </label>
                  <input
                    type="text"
                    name="penerima"
                    value={form.penerima}
                    onChange={handleChange}
                    placeholder="Contoh: Admin Takah"
                    required
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs outline-none transition hover:border-blue-300 focus:border-blue-400"
                  />
                </div>
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
                  placeholder="Contoh: Undangan Kerja Sama"
                  required
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs outline-none transition hover:border-blue-300 focus:border-blue-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold text-slate-700">
                  File Surat / Lampiran
                </label>

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center transition hover:border-blue-300 hover:bg-blue-50/40">
                  <Upload size={26} className="text-blue-600" />
                  <p className="mt-2 text-xs font-bold text-slate-700">
                    Klik untuk upload file
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Format yang didukung: PDF, DOC, DOCX
                  </p>

                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                {fileName && (
                  <div className="mt-3 rounded-xl bg-blue-50 px-4 py-3 text-xs font-semibold text-blue-700">
                    File dipilih: {fileName}
                  </div>
                )}

                {editId && !form.file_surat && fileName && (
                  <p className="mt-2 text-[11px] text-slate-500">
                    Biarkan kosong jika tidak ingin mengganti file lama.
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold text-slate-700">
                  Keterangan
                </label>
                <textarea
                  name="keterangan"
                  value={form.keterangan}
                  onChange={handleChange}
                  placeholder="Contoh: Surat diterima melalui email"
                  rows="4"
                  className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-xs leading-relaxed outline-none transition hover:border-blue-300 focus:border-blue-400"
                />
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
                  disabled={saving}
                  className="rounded-xl bg-[#2680BE] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#1f6fa7] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {saving
                    ? "Menyimpan..."
                    : editId
                    ? "Simpan Perubahan"
                    : "Simpan Surat"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDetail && selectedSurat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between bg-gradient-to-r from-[#002248] to-[#2680BE] px-5 py-4 text-white">
              <div>
                <h2 className="text-base font-extrabold">
                  Detail Surat Masuk
                </h2>
                <p className="mt-1 text-xs text-white/70">
                  {selectedSurat.nomor_surat}
                </p>
              </div>

              <button
                type="button"
                onClick={closeDetailModal}
                className="rounded-full p-2 transition hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 p-5 text-xs">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="font-bold text-slate-900">Nomor Surat</p>
                <p className="mt-1 text-slate-600">
                  {selectedSurat.nomor_surat}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-bold text-slate-900">Pengirim</p>
                  <p className="mt-1 text-slate-600">
                    {selectedSurat.pengirim}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-bold text-slate-900">Penerima</p>
                  <p className="mt-1 text-slate-600">
                    {selectedSurat.penerima}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="font-bold text-slate-900">Perihal</p>
                <p className="mt-1 text-slate-600">{selectedSurat.perihal}</p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-bold text-slate-900">Tanggal Surat</p>
                  <p className="mt-1 text-slate-600">
                    {selectedSurat.tanggal_surat}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-bold text-slate-900">Status</p>
                  <span
                    className={`mt-2 inline-flex rounded-full px-3 py-1 text-[11px] font-bold ${getStatusClass(
                      selectedSurat.status
                    )}`}
                  >
                    {getStatusLabel(selectedSurat.status)}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="font-bold text-slate-900">Keterangan</p>
                <p className="mt-1 leading-relaxed text-slate-600">
                  {selectedSurat.keterangan || "-"}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="font-bold text-slate-900">File Surat</p>

                {selectedSurat.file_surat ? (
                  <a
                    href={getFileUrl(selectedSurat.file_surat)}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2.5 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
                  >
                    <Download size={15} />
                    Lihat / Download File
                  </a>
                ) : (
                  <p className="mt-1 text-slate-600">-</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuratMasuk;