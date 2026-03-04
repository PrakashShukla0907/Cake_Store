import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/auth.api";
import { AuthContext } from "../context/AuthContext";
import { getProfile } from "../api/auth.api";
import { useTheme } from "../context/ThemeContext";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const { theme } = useTheme();

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginUser(formData);
      if (res.data && res.data.token) {
        localStorage.setItem("token", res.data.token);
      }
      const profileRes = await getProfile();

      setUser(profileRes.data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={classNames(
        "min-h-screen flex items-center justify-center pb-12 pt-8 transition-colors duration-300",
        theme === "dark"
          ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-200"
          : "bg-theme-cream-gradient text-slate-800",
      )}
    >
      <div className="w-full max-w-md px-4 sm:px-0">


        {/* Login Card */}
        <div
          className={classNames(
            "rounded-2xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden",
            theme === "dark"
              ? "bg-slate-800/80 border border-slate-700 shadow-slate-900/50"
              : "bg-theme-cream-solid/80 border border-white/50 shadow-rose-200/50",
          )}
        >
          {/* Subtle decoration */}
          <div className="absolute top-0 right-0 -tralsate-y-4 translate-x-4 w-24 h-24 bg-rose-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20 dark:opacity-10 pointer-events-none"></div>

          <h3 className={classNames(
            "text-2xl font-bold mb-6 text-center tracking-tight",
            theme === "dark" ? "text-white" : "text-slate-900"
          )}>
            Welcome Back!
          </h3>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl mb-6 text-sm font-medium flex items-center gap-2">
              <span className="shrink-0">⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold mb-2 opacity-90">
                Email or Phone
              </label>
              <input
                type="text"
                name="identifier"
                placeholder="Enter your email or phone number"
                value={formData.identifier}
                onChange={handleChange}
                required
                className={classNames(
                  "w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all duration-300 font-medium",
                  theme === "dark"
                    ? "bg-slate-900/50 border-slate-700 text-slate-200 placeholder-slate-500 focus:bg-slate-900 focus:border-rose-500/50 focus:ring-4 focus:ring-rose-500/10"
                    : "bg-theme-cream-solid/50 border-gray-200 text-slate-900 placeholder-gray-400 focus:bg-theme-cream-solid focus:border-rose-300 focus:ring-4 focus:ring-rose-100",
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 opacity-90">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className={classNames(
                  "w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all duration-300 font-medium",
                  theme === "dark"
                    ? "bg-slate-900/50 border-slate-700 text-slate-200 placeholder-slate-500 focus:bg-slate-900 focus:border-rose-500/50 focus:ring-4 focus:ring-rose-500/10"
                    : "bg-theme-cream-solid/50 border-gray-200 text-slate-900 placeholder-gray-400 focus:bg-theme-cream-solid focus:border-rose-300 focus:ring-4 focus:ring-rose-100",
                )}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={classNames(
                "w-full py-3.5 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 mt-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
                loading
                  ? "opacity-70 cursor-not-allowed bg-gray-400 text-white shadow-none"
                  : "bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white border border-rose-400/30"
              )}
            >
              {loading ? "🔄 Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm font-medium opacity-80">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-bold text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 transition-colors underline decoration-2 underline-offset-4"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm opacity-60">
          <p>✓ Safe checkout • ✓ Free delivery • ✓ Quality guaranteed</p>
        </div>
      </div>
    </div>
  );
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default Login;
