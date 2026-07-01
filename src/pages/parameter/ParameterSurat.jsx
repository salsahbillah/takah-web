import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Edit,
  FileText,
  Layers,
  Plus,
  Search,
  Settings2,
  Trash2,
  XCircle,
} from "lucide-react";

function ParameterSurat() {
  const [searchQuery, setSearchQuery] = useState("");
  const [templateFilter, setTemplateFilter] = useState("semua");
  const [requiredFilter, setRequiredFilter] = useState("semua");

  const parameterData = [
    {
      id: 1,
      templateName: "Surat Undangan",
      parameterName: "Nama Tujuan",
      parameterKey: "nama_tujuan",
      inputType: "text",
      isRequired: true,
    },
    {
      id: 2,
      templateName: "Surat Undangan",
      parameterName: "Nama Kegiatan",
      parameterKey: "nama_kegiatan",
      inputType: "text",
      isRequired: true,
    },
    {
      id: 3,
      templateName: "Surat Undangan",
      parameterName: "Tanggal Kegiatan",
      parameterKey: "tanggal_kegiatan",
      inputType: "date",
      isRequired: true,
    },
    {
      id: 4,
      templateName: "Surat Keterangan Kerja",
      parameterName: "Nama Pegawai",
      parameterKey: "nama_pegawai",
      inputType: "text",
      isRequired: true,
    },
    {
      id: 5,
      templateName: "Surat Keterangan Kerja",
      parameterName: "Jabatan",
      parameterKey: "jabatan",
      inputType: "text",
      isRequired: false,
    },
  ];

  const templateOptions = [
    "Surat Undangan",
    "Surat Keterangan Kerja",
    "Surat Penugasan",
    "Memorandum",
  ];

  const filteredData = useMemo(() => {
    return parameterData.filter((item) => {
      const search = searchQuery.toLowerCase();

      const matchSearch =
        item.templateName.toLowerCase().includes(search) ||
        item.parameterName.toLowerCase().includes(search) ||
        item.parameterKey.toLowerCase().includes(search) ||
        item.inputType.toLowerCase().includes(search);

      const matchTemplate =
        templateFilter === "semua" || item.templateName === templateFilter;

      const matchRequired =
        requiredFilter === "semua" ||
        (requiredFilter === "wajib" && item.isRequired) ||
        (requiredFilter === "opsional" && !item.isRequired);

      return matchSearch && matchTemplate && matchRequired;
    });
  }, [searchQuery, templateFilter, requiredFilter]);

  const totalParameter = parameterData.length;
  const totalRequired = parameterData.filter((item) => item.isRequired).length;
  const totalOptional = parameterData.filter((item) => !item.isRequired).length;
  const totalTemplate = new Set(parameterData.map((item) => item.templateName))
    .size;

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
    };

    return styles[type] || "bg-slate-100 text-slate-700";
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
                {templateOptions.map((template) => (
                  <option key={template} value={template}>
                    {template}
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
            <table className="w-full min-w-[900px] border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
                  <th className="px-4 py-3 font-bold">Template</th>
                  <th className="px-4 py-3 font-bold">Nama Parameter</th>
                  <th className="px-4 py-3 font-bold">Key Parameter</th>
                  <th className="px-4 py-3 font-bold">Tipe Input</th>
                  <th className="px-4 py-3 font-bold">Status</th>
                  <th className="px-4 py-3 text-right font-bold">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {filteredData.map((item) => (
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
                          {item.templateName}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {item.parameterName}
                    </td>

                    <td className="px-4 py-3">
                      <span className="rounded-lg bg-slate-100 px-3 py-1 font-mono text-[11px] font-bold text-slate-700">
                        {item.parameterKey}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-bold capitalize ${getInputTypeBadge(
                          item.inputType
                        )}`}
                      >
                        {item.inputType}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                          item.isRequired
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {item.isRequired ? "Wajib" : "Opsional"}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          className="rounded-lg bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100 hover:shadow-sm"
                          title="Edit"
                        >
                          <Edit size={15} />
                        </button>

                        <button
                          type="button"
                          className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100 hover:shadow-sm"
                          title="Hapus"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredData.length === 0 && (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-4 py-8 text-center text-slate-500"
                    >
                      Data parameter surat tidak ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-col justify-between gap-3 text-xs text-slate-500 sm:flex-row sm:items-center">
            <p>
              Menampilkan{" "}
              <span className="font-bold text-slate-700">
                {filteredData.length}
              </span>{" "}
              dari{" "}
              <span className="font-bold text-slate-700">
                {parameterData.length}
              </span>{" "}
              data parameter.
            </p>

            <div className="flex items-center gap-2">
              <button className="rounded-lg border border-slate-200 px-3 py-2 font-semibold text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600">
                Previous
              </button>
              <button className="rounded-lg bg-[#2680BE] px-3 py-2 font-bold text-white shadow-sm transition hover:bg-[#1f6fa7]">
                1
              </button>
              <button className="rounded-lg border border-slate-200 px-3 py-2 font-semibold text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ParameterSurat;