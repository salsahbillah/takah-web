import { useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  Camera,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Save,
  ShieldCheck,
  User,
  UserCircle,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import {
  getProfile,
  updatePassword,
  updateProfile,
  uploadProfilePhoto,
} from "../../services/profileService";
import { Pencil } from "lucide-react";

const API_URL = "http://localhost:8080";

function Profile() {
  const { user, role, updateUser } = useAuth();
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState(user);
  const [name, setName] = useState(user?.name || "");
  const [photoPreview, setPhotoPreview] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const getRoleLabel = (roleValue) => {
    if (roleValue === "admin") return "Administrator";
    if (roleValue === "user") return "User";
    return "User";
  };

  const getInitial = (nameValue) => {
    if (!nameValue) return "US";

    return nameValue
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const getPhotoUrl = (photoUrl) => {
    if (!photoUrl) return "";
    if (photoUrl.startsWith("http")) return photoUrl;
    return `${API_URL}${photoUrl}`;
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await getProfile();

      setProfile(response.data);
      setName(response.data.name || "");
      setPhotoPreview(getPhotoUrl(response.data.photo_url));
      updateUser(response.data);
    } catch (err) {
      console.error("Gagal mengambil profile:", err);
      setError("Gagal mengambil data profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (!message && !error) return;

    const timer = setTimeout(() => {
      setMessage("");
      setError("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [message, error]);

  const handleUpdateProfile = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      setSavingProfile(true);

      const response = await updateProfile({ name });

      setProfile(response.data);
      updateUser(response.data);

      setMessage("Nama profile berhasil diperbarui.");
    } catch (err) {
      console.error("Gagal update profile:", err);
      setError(err.response?.data?.message || "Gagal mengubah profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      setSavingPassword(true);

      await updatePassword({
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setMessage("Password berhasil diubah.");
    } catch (err) {
      console.error("Gagal update password:", err);
      setError(err.response?.data?.message || "Gagal mengubah password.");
    } finally {
      setSavingPassword(false);
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  const handlePhotoChange = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    setMessage("");
    setError("");

    try {
      setUploadingPhoto(true);

      const response = await uploadProfilePhoto(file);

      const updatedProfile = {
        ...profile,
        photo_url: response.data.photo_url,
      };

      setProfile(updatedProfile);
      updateUser(updatedProfile);
      setPhotoPreview(getPhotoUrl(response.data.photo_url));

      setMessage("Foto profile berhasil diperbarui.");
    } catch (err) {
      console.error("Gagal upload foto:", err);
      setError(err.response?.data?.message || "Gagal upload foto profile.");
    } finally {
      setUploadingPhoto(false);
      event.target.value = "";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-4 text-[13px] lg:px-5 lg:py-5">
        <div className="mx-auto w-full max-w-[1180px]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
            Memuat data profile...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-4 text-[13px] lg:px-5 lg:py-5">
      <div className="mx-auto w-full max-w-[1180px]">
        <div className="mb-4 overflow-hidden rounded-2xl bg-gradient-to-r from-[#002248] to-[#2680BE] text-white shadow-md">
          <div className="p-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white/30 bg-white/10 text-2xl font-extrabold shadow-lg">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Foto Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : profile?.name ? (
                      getInitial(profile.name)
                    ) : (
                      <UserCircle size={44} />
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handlePhotoClick}
                    disabled={uploadingPhoto}
                    className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#002248] shadow-md transition hover:scale-105 hover:bg-blue-50 disabled:opacity-60"
                    title="Upload Foto"
                  >
                    <Camera size={17} />
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </div>

                <div>
                  <p className="text-xs text-white/70">Profile Saya</p>
                  <h1 className="mt-1 text-2xl font-extrabold">
                    {profile?.name || "User Takah"}
                  </h1>

                  <p className="mt-1 text-sm font-medium text-white/80">
                    {getRoleLabel(profile?.role || role)}
                  </p>

                  <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-emerald-300">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    Online
                  </div>

                  {uploadingPhoto && (
                    <p className="mt-2 text-xs text-white/70">
                      Mengupload foto...
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-sm">
                <p className="text-xs text-white/70">Hak Akses</p>
                <p className="mt-1 flex items-center gap-2 text-sm font-bold">
                  <ShieldCheck size={16} />
                  {getRoleLabel(profile?.role || role)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {message && (
          <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-xs font-semibold text-emerald-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-xs font-semibold text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5">
              <h2 className="text-base font-extrabold text-slate-900">
                Informasi Akun
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Ubah nama profile dan lihat informasi akun yang sedang login.
              </p>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-bold text-slate-700">
                  Nama Lengkap
                </label>
                <div className="relative">
                <User
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-9 text-xs outline-none transition hover:border-blue-300 focus:border-blue-400"
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>
              </div>
              <button
                  type="submit"
                  disabled={savingProfile || name.trim() === profile?.name?.trim()}
                  className="flex items-center gap-2 rounded-xl bg-[#2680BE] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#1f6fa7] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save size={16} />
                  {savingProfile ? "Menyimpan..." : "Simpan Profile"}
                </button>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                    <Mail size={20} />
                  </div>
                  <p className="text-xs font-semibold text-slate-500">Email</p>
                  <p className="mt-1 break-all font-bold text-slate-900">
                    {profile?.email || "-"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                    <ShieldCheck size={20} />
                  </div>
                  <p className="text-xs font-semibold text-slate-500">Role</p>
                  <p className="mt-1 font-bold text-slate-900">
                    {getRoleLabel(profile?.role || role)}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    <CalendarDays size={20} />
                  </div>
                  <p className="text-xs font-semibold text-slate-500">
                    Bergabung
                  </p>
                  <p className="mt-1 font-bold text-slate-900">
                    {profile?.created_at || "-"}
                  </p>
                </div>
              </div>

              
            </form>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-extrabold text-slate-900">
                Keamanan Akun
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Ubah password akun untuk menjaga keamanan akses.
              </p>

              <form onSubmit={handleUpdatePassword} className="mt-5 space-y-4">
                <PasswordInput
                  label="Password Lama"
                  value={oldPassword}
                  onChange={setOldPassword}
                  show={showOldPassword}
                  setShow={setShowOldPassword}
                  placeholder="Masukkan password lama"
                />

                <PasswordInput
                  label="Password Baru"
                  value={newPassword}
                  onChange={setNewPassword}
                  show={showNewPassword}
                  setShow={setShowNewPassword}
                  placeholder="Masukkan password baru"
                />

                <PasswordInput
                  label="Konfirmasi Password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  show={showConfirmPassword}
                  setShow={setShowConfirmPassword}
                  placeholder="Ulangi password baru"
                />

                <button
                  type="submit"
                  disabled={savingPassword}
                  className="w-full rounded-xl bg-[#2680BE] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#1f6fa7] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {savingPassword ? "Menyimpan..." : "Ubah Password"}
                </button>
              </form>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-extrabold text-slate-900">
                Hak Akses
              </h2>

              <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-xs leading-relaxed text-slate-600">
                {role === "admin"
                  ? "Administrator dapat mengelola data master, template, parameter, config nomor, surat, approval, monitoring, dan seluruh data sistem."
                  : "User hanya dapat mengelola dan melihat data surat yang berkaitan dengan akunnya sendiri."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PasswordInput({ label, value, onChange, show, setShow, placeholder }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold text-slate-700">
        {label}
      </label>

      <div className="relative">
        <Lock
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-10 text-xs outline-none transition hover:border-blue-300 focus:border-blue-400"
          placeholder={placeholder}
          required
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}

export default Profile;