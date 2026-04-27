import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { loginUser } from "../api/auth";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setError("");
      setLoading(true);

      const res = await loginUser({
        email: username,
        password,
      });

      localStorage.setItem("token", res.data.token);

      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      navigate("/select-company");
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F5F7FA] overflow-hidden">
      {/* LEFT PANEL */}
      <section className="relative flex-1 bg-[#1349EC] text-white flex items-center justify-center px-10">
        <div className="absolute top-12 left-10 flex items-center gap-5">
          <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
            <rect width="50" height="50" rx="5" fill="white" />
            <path
              d="M32.6364 33.0312C32.13 33.0312 31.6445 32.8238 31.2864 32.4546C30.9284 32.0854 30.7273 31.5846 30.7273 31.0625C30.7273 30.5404 30.9284 30.0396 31.2864 29.6704C31.6445 29.3012 32.13 29.0938 32.6364 29.0938C33.1427 29.0938 33.6283 29.3012 33.9863 29.6704C34.3443 30.0396 34.5455 30.5404 34.5455 31.0625C34.5455 31.5846 34.3443 32.0854 33.9863 32.4546C33.6283 32.8238 33.1427 33.0312 32.6364 33.0312ZM34.5455 21.2188L37.04 24.5H31.3636V21.2188M17.3636 33.0312C16.8573 33.0312 16.3717 32.8238 16.0137 32.4546C15.6557 32.0854 15.4545 31.5846 15.4545 31.0625C15.4545 30.5404 15.6557 30.0396 16.0137 29.6704C16.3717 29.3012 16.8573 29.0938 17.3636 29.0938C17.87 29.0938 18.3555 29.3012 18.7136 29.6704C19.0716 30.0396 19.2727 30.5404 19.2727 31.0625C19.2727 31.5846 19.0716 32.0854 18.7136 32.4546C18.3555 32.8238 17.87 33.0312 17.3636 33.0312ZM35.1818 19.25H31.3636V14H13.5455C12.1327 14 11 15.1681 11 16.625V31.0625H13.5455C13.5455 32.1068 13.9477 33.1083 14.6638 33.8467C15.3798 34.5852 16.351 35 17.3636 35C18.3763 35 19.3475 34.5852 20.0635 33.8467C20.7795 33.1083 21.1818 32.1068 21.1818 31.0625H28.8182C28.8182 32.1068 29.2205 33.1083 29.9365 33.8467C30.6525 34.5852 31.6237 35 32.6364 35C33.649 35 34.6202 34.5852 35.3362 33.8467C36.0523 33.1083 36.4545 32.1068 36.4545 31.0625H39V24.5L35.1818 19.25Z"
              fill="#1349EC"
            />
          </svg>

          <h1 className="text-[25px] font-bold tracking-tight">ERP</h1>
        </div>

        <div className="w-full max-w-[514px]">
          <h2 className="text-[40px] leading-[48px] font-bold tracking-[-1px]">
            All-in-one ERP software to manage your operations, finance, HR,
            sales, and more efficiently and seamlessly.
          </h2>

          <p className="mt-7 text-[20px] leading-[24px] text-white/90 font-light">
            Streamlining global logistics with precision, we ensure every
            movement is optimized, every delivery is timely, and every operation
            runs seamlessly.
          </p>
        </div>
      </section>

      {/* RIGHT PANEL */}
      <section className="flex-1 bg-[#F6F6F8] flex items-center justify-center px-10">
        <div className="w-full max-w-[580px] rounded-xl bg-white px-14 py-14 shadow-[0_15px_45px_rgba(0,0,0,0.12)]">
          <h3 className="text-[30px] font-bold text-[#363636]">Welcome back</h3>

          <p className="mt-4 text-[20px] text-[#4A4A4A]">
            Please enter your details to access the dashboard.
          </p>

          {/* Username */}
          <div className="mt-10">
            <label className="block mb-3 text-[18px] font-semibold text-[#363636]">
              Username
            </label>

            <div className="h-[56px] border border-[#D8D8D8] rounded-md px-4 flex items-center gap-3">
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError("");
                }}
                placeholder="Enter your email"
                className="flex-1 bg-transparent outline-none text-[16px]"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mt-6">
            <label className="block mb-3 text-[18px] font-semibold text-[#363636]">
              Password
            </label>

            <div className="h-[56px] border border-[#D8D8D8] rounded-md px-4 flex items-center gap-3">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="Enter your password"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="flex-1 bg-transparent outline-none text-[16px]"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[#A9A9A9]"
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="mt-2 text-center text-sm text-red-500 font-medium">
              {error}
            </p>
          )}

          {/* Login */}
          <button
            onClick={handleLogin}
            disabled={!username || !password || loading}
            className={`h-[58px] w-full rounded-md text-white text-[18px] font-semibold transition ${
              error ? "mt-2" : "mt-8"
            } bg-[#1349EC] hover:bg-blue-700 disabled:bg-[#9DB4F8]`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="mt-6 text-center text-[14px] text-[#5A5A5A]">
            Authorized personnel only.
          </p>
        </div>
      </section>
    </div>
  );
}
