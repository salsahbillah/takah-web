import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Save,
} from "lucide-react";

import {
  getAllTakah,
  createTakah,
  updateTakah,
  deleteTakah,
} from "../../services/takahService";

const initialForm = {
  code: "",
  name: "",
  description: "",
  order: 1,
};

function MasterTakah() {
  const [dataTakah, setDataTakah] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchTakah = async () => {
    try {
      setLoading(true);

      const result = await getAllTakah();
      const data = Array.isArray(result) ? result : result.data || [];

      setDataTakah(data);
    } catch (error) {
      alert("Gagal mengambil data Master Takah");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTakah();
  }, []);

  const filteredTakah = useMemo(() => {
    return dataTakah.filter((item) => {
      const keyword = search.toLowerCase();

      return (
        item.code?.toLowerCase().includes(keyword) ||
        item.name?.toLowerCase().includes(keyword) ||
        item.description?.toLowerCase().includes(keyword)
      );
    });
  }, [dataTakah, search]);

  const handleOpenAddModal = () => {
    setForm({
      ...initialForm,
      order: dataTakah.length + 1,
    });
    setEditId(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setForm(initialForm);
    setEditId(null);
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = (item) => {
    setEditId(item.id);

    setForm({
      code: item.code || "",
      name: item.name || "",
      description: item.description || "",
      order: item.order || 1,
    });

    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.code || !form.name || !form.description || !form.order) {
      alert("Data takah wajib diisi dengan benar");
      return;
    }

    try {
      setSaving(true);

      if (editId) {
        await updateTakah(editId, form);
        alert("Master Takah berhasil diperbarui");
      } else {
        await createTakah(form);
        alert("Master Takah berhasil ditambahkan");
      }

      handleCloseModal();
      fetchTakah();
    } catch (error) {
      alert(
        error.response?.data?.message || "Gagal menyimpan data Master Takah"
      );
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = confirm("Yakin ingin menghapus data Master Takah ini?");

    if (!confirmDelete) return;

    try {
      await deleteTakah(id);
      alert("Master Takah berhasil dihapus");
      fetchTakah();
    } catch (error) {
      alert("Gagal menghapus data Master Takah");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-linear-to-r from-[#082f5f] via-[#0f5f99] to-[#2b8fd3] p-8 shadow-lg">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-100">
              Data Master
            </p>

            <h1 className="mt-1 text-4xl font-bold text-white">
              Master Takah
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-blue-100">
              Kelola data jenis surat yang digunakan pada sistem Takah.
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-bold text-[#0f5f99] shadow-sm transition hover:scale-[1.02] lg:w-auto"
          >
            <Plus size={18} />
            Tambah Master
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Data Master Takah
            </h2>
            <p className="text-sm text-slate-500">
              Data ini akan dipakai pada Parameter Surat, Template Surat, dan
              Surat Keluar.
            </p>
          </div>

          <div className="relative w-full lg:w-80">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari kode atau nama surat..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-200 border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-sm text-slate-600">
                <th className="px-4 py-4 font-semibold">No</th>
                <th className="px-4 py-4 font-semibold">Kode</th>
                <th className="px-4 py-4 font-semibold">Nama Takah</th>
                <th className="px-4 py-4 font-semibold">Deskripsi</th>
                <th className="px-4 py-4 text-center font-semibold">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-4 py-10 text-center text-sm text-slate-500"
                  >
                    Memuat data Master Takah...
                  </td>
                </tr>
              ) : filteredTakah.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-4 py-10 text-center text-sm text-slate-500"
                  >
                    Belum ada data Master Takah.
                  </td>
                </tr>
              ) : (
                filteredTakah.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-b border-slate-100 text-sm text-slate-700 transition hover:bg-slate-50"
                  >
                    <td className="px-4 py-4">{index + 1}</td>

                    <td className="px-4 py-4">
                      <span className="rounded-lg bg-blue-50 px-3 py-1 font-bold text-blue-700">
                        {item.code || "-"}
                      </span>
                    </td>

                    <td className="px-4 py-4 font-semibold text-slate-900">
                      {item.name || "-"}
                    </td>

                    <td className="px-4 py-4">{item.description || "-"}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="rounded-lg bg-amber-100 p-2 text-amber-700 transition hover:bg-amber-200"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>

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
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editId ? "Edit Master Takah" : "Tambah Master Takah"}
                </h2>
                <p className="text-sm text-slate-500">
                  Isi data jenis surat yang akan digunakan pada sistem.
                </p>
              </div>

              <button
                onClick={handleCloseModal}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Kode Takah
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={form.code}
                    onChange={handleChange}
                    placeholder="Contoh: UND"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Nama Takah
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Contoh: Surat Undangan"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Deskripsi
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Masukkan deskripsi singkat..."
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
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
                  {saving ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MasterTakah;