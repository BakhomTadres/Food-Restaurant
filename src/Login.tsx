import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordShow, setPasswordShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let valid = true;

    if (!emailInput) {
      setEmailError("Please enter your email");
      valid = false;
    } else if (!emailInput.includes("@")) {
      setEmailError("Please enter a valid email address");
      valid = false;
    } else if (emailInput !== localStorage.getItem("email")) {
      setEmailError("This email was not found");
      valid = false;
    } else {
      setEmailError("");
    }

    if (passwordInput.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      valid = false;
    } else if (passwordInput !== localStorage.getItem("password")) {
      setPasswordError("Incorrect password");
      valid = false;
    } else {
      setPasswordError("");
    }

    if (valid) {
      setLoading(true);
      setTimeout(() => {
        localStorage.setItem("isLogin", "true");
        navigate("/");
      }, 800);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl"></div>
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
          <h1 className="text-3xl font-black text-amber-50 mb-1">
            Welcome back
          </h1>
          <p className="text-gray-400 mb-8">
            Sign in to your account to continue
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                  <i className="fa-solid fa-envelope text-sm"></i>
                </div>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => {
                    setEmailInput(e.target.value);
                    setEmailError("");
                  }}
                  placeholder="your@email.com"
                  className={`w-full bg-gray-700 border ${emailError ? "border-red-500 bg-red-500/5" : "border-white/10 focus:border-amber-400"} text-amber-50 placeholder-gray-500 rounded-xl pl-10 pr-4 py-3.5 text-sm outline-none transition`}
                />
              </div>
              {emailError && (
                <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  {emailError}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                  <i className="fa-solid fa-lock text-sm"></i>
                </div>
                <input
                  type={passwordShow ? "text" : "password"}
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setPasswordError("");
                  }}
                  placeholder="Enter your password"
                  className={`w-full bg-gray-700 border ${passwordError ? "border-red-500 bg-red-500/5" : "border-white/10 focus:border-amber-400"} text-amber-50 placeholder-gray-500 rounded-xl pl-10 pr-12 py-3.5 text-sm outline-none transition`}
                />
                <button
                  type="button"
                  onClick={() => setPasswordShow(!passwordShow)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition cursor-pointer"
                >
                  <i
                    className={`fa-solid ${passwordShow ? "fa-eye" : "fa-eye-slash"} text-sm`}
                  ></i>
                </button>
              </div>
              {passwordError && (
                <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  {passwordError}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-400 hover:bg-amber-300 disabled:opacity-60 text-gray-900 font-black py-3.5 rounded-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer text-base mt-2"
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner animate-spin"></i>
                  Signing in...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-right-to-bracket"></i>
                  Log In
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{" "}
              <a
                onClick={() => navigate("/register")}
                className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer transition"
              >
                Sign up for free
              </a>
            </p>
          </div>
        </div>

        <p className="text-center text-gray-600 text-sm mt-6">
          <a
            onClick={() => navigate("/")}
            className="hover:text-gray-400 cursor-pointer transition flex items-center justify-center gap-1"
          >
            <i className="fa-solid fa-arrow-left text-xs"></i>
            Back to Home
          </a>
        </p>
      </div>
    </div>
  );
}
