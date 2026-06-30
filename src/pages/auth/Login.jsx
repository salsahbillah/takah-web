import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../services/authService";

import loginBg from "../../assets/images/login-bg.png";
import logoTakah from "../../assets/logo/logo-takah-icon.png";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("admin@takah.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleQuickLogin = (type) => {
    if (type === "admin") {
      setEmail("admin@takah.com");
      setPassword("password123");
    } else {
      setEmail("user@takah.com");
      setPassword("password123");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await loginUser({ email, password });
      login(result.data.token, result.data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login gagal. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      {/* Overlay biru transparan */}
      <div className="absolute inset-0 bg-[#002248]/60" />

      <section className="relative z-10 flex min-h-screen items-center justify-between px-16 py-10">
        {/* KIRI */}
        <div className="w-[50%] text-white">
          {/* Logo */}
          <div className="absolute left-16 top-10 flex items-center gap-3">
            <img
              src={logoTakah}
              alt="Logo TAKAH"
              className="h-11 w-11 object-contain"
            />
            <h1 className="text-2xl font-extrabold italic leading-none">
              Takah
            </h1>
          </div>

          {/* Konten kiri dinaikkan */}
          <div className="-mt-10 max-w-lg">
            <h2 className="text-[42px] font-black leading-[1.05] tracking-tight">
              Sistem Pengelolaan <br />
              Surat Digital
            </h2>

            <div className="mt-4 h-[3px] w-28 rounded-full bg-white" />

            <p className="mt-8 max-w-md text-[13px] font-medium leading-relaxed text-white/95">
              Digitalisasi pengelolaan surat untuk proses administrasi yang
              lebih cepat, rapi, dan efisien.
            </p>

            {/* Tombol role diturunkan */}
            <div className="mt-28 flex items-center gap-6">
              <Button
                onClick={() => handleQuickLogin("user")}
                className="h-10 min-w-[130px] px-6 text-[13px]"
              >
                Login User
              </Button>

              <Button
                onClick={() => handleQuickLogin("admin")}
                className="ml-6 h-10 min-w-[170px] px-6 text-[13px]"
              >
                Login Admin/Staff
              </Button>
            </div>
          </div>
        </div>

        {/* KANAN */}
        <div className="mr-2 flex w-[45%] justify-center">
          <div className="w-[430px] rounded-[32px] bg-white/22 px-16 py-11 shadow-2xl backdrop-blur-md">
            <h2 className="mb-10 text-center text-[36px] font-black text-white">
              Login
            </h2>

            <form onSubmit={handleSubmit}>
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan email"
              />

              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="mt-5"
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="flex items-center"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                }
              />

              {error && (
                <p className="mt-4 text-center text-xs font-semibold text-red-200">
                  {error}
                </p>
              )}

              <div className="mt-8 flex justify-center">
                <Button
                  type="submit"
                  disabled={loading}
                  className="h-10 min-w-[150px] text-[13px]"
                >
                  {loading ? "Loading..." : "Login"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Login;