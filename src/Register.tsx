import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordShow, setPasswordShow] = useState(false);
  const [confirmShow, setConfirmShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
    if (e.target.name === "email") localStorage.setItem("email", e.target.value);
    if (e.target.name === "password") localStorage.setItem("password", e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!form.email.includes("@")) newErrors.email = "Enter a valid email address";
    if (form.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (form.confirm !== form.password) newErrors.confirm = "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("isLogin", "true");
      navigate("/");
    }, 800);
  };

  const passwordStrength = (pw: string) => {
    if (pw.length === 0) return null;
    if (pw.length < 6) return { label: "Weak", color: "bg-red-500", width: "w-1/4" };
    if (pw.length < 10) return { label: "Fair", color: "bg-amber-400", width: "w-2/4" };
    if (pw.length < 14) return { label: "Good", color: "bg-green-400", width: "w-3/4" };
    return { label: "Strong", color: "bg-green-500", width: "w-full" };
  };

  const strength = passwordStrength(form.password);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
              <i className="fa-solid fa-utensils text-gray-900"></i>
            </div>
            <span className="text-2xl font-black text-amber-50">
              Food<span className="text-amber-400">.</span>
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-gray-800 border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/40">
          <h1 className="text-3xl font-black text-amber-50 mb-1">Create account</h1>
          <p className="text-gray-400 mb-8">Join us and start ordering delicious food</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1.5">Full Name</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                  <i className="fa-solid fa-user text-sm"></i>
                </div>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className={`w-full bg-gray-700 border ${errors.name ? "border-red-500" : "border-white/10 focus:border-amber-400"} text-amber-50 placeholder-gray-500 rounded-xl pl-10 pr-4 py-3.5 text-sm outline-none transition`}
                />
              </div>
              {errors.name && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><i className="fa-solid fa-circle-exclamation"></i>{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1.5">Email Address</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                  <i className="fa-solid fa-envelope text-sm"></i>
                </div>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className={`w-full bg-gray-700 border ${errors.email ? "border-red-500" : "border-white/10 focus:border-amber-400"} text-amber-50 placeholder-gray-500 rounded-xl pl-10 pr-4 py-3.5 text-sm outline-none transition`}
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><i className="fa-solid fa-circle-exclamation"></i>{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                  <i className="fa-solid fa-lock text-sm"></i>
                </div>
                <input
                  type={passwordShow ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  className={`w-full bg-gray-700 border ${errors.password ? "border-red-500" : "border-white/10 focus:border-amber-400"} text-amber-50 placeholder-gray-500 rounded-xl pl-10 pr-12 py-3.5 text-sm outline-none transition`}
                />
                <button type="button" onClick={() => setPasswordShow(!passwordShow)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition cursor-pointer">
                  <i className={`fa-solid ${passwordShow ? "fa-eye" : "fa-eye-slash"} text-sm`}></i>
                </button>
              </div>
              {strength && (
                <div className="mt-2">
                  <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div className={`h-full ${strength.color} ${strength.width} transition-all duration-300 rounded-full`}></div>
                  </div>
                  <p className={`text-xs mt-1 font-semibold`} style={{ color: strength.color.includes("red") ? "#f87171" : strength.color.includes("amber") ? "#fbbf24" : "#4ade80" }}>
                    {strength.label} password
                  </p>
                </div>
              )}
              {errors.password && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><i className="fa-solid fa-circle-exclamation"></i>{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1.5">Confirm Password</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                  <i className="fa-solid fa-lock text-sm"></i>
                </div>
                <input
                  type={confirmShow ? "text" : "password"}
                  name="confirm"
                  value={form.confirm}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  className={`w-full bg-gray-700 border ${errors.confirm ? "border-red-500" : form.confirm && form.confirm === form.password ? "border-green-500" : "border-white/10 focus:border-amber-400"} text-amber-50 placeholder-gray-500 rounded-xl pl-10 pr-12 py-3.5 text-sm outline-none transition`}
                />
                <button type="button" onClick={() => setConfirmShow(!confirmShow)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition cursor-pointer">
                  <i className={`fa-solid ${confirmShow ? "fa-eye" : "fa-eye-slash"} text-sm`}></i>
                </button>
              </div>
              {errors.confirm && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><i className="fa-solid fa-circle-exclamation"></i>{errors.confirm}</p>}
              {form.confirm && form.confirm === form.password && !errors.confirm && (
                <p className="text-green-400 text-xs mt-1 flex items-center gap-1"><i className="fa-solid fa-circle-check"></i>Passwords match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-400 hover:bg-amber-300 disabled:opacity-60 text-gray-900 font-black py-3.5 rounded-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer text-base mt-2"
            >
              {loading ? (
                <><i className="fa-solid fa-spinner animate-spin"></i>Creating account...</>
              ) : (
                <><i className="fa-solid fa-user-plus"></i>Create Account</>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <a onClick={() => navigate("/login")} className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer transition">
                Log in
              </a>
            </p>
          </div>
        </div>

        <p className="text-center text-gray-600 text-sm mt-6">
          <a onClick={() => navigate("/")} className="hover:text-gray-400 cursor-pointer transition flex items-center justify-center gap-1">
            <i className="fa-solid fa-arrow-left text-xs"></i>
            Back to Home
          </a>
        </p>
      </div>
    </div>
  );
}