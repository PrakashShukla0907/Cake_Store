import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/auth.api";
import { AuthContext } from "../context/AuthContext";
import { getProfile } from "../api/auth.api";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await loginUser(formData);
      if (res.data?.token) localStorage.setItem("token", res.data.token);
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
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black text-black tracking-tight">Welcome back</h1>
          <p className="mt-1 text-sm text-gray-500 font-medium">Sign in to your Gopal Bakers account</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">

          {error && (
            <div className="bg-gray-50 border border-gray-300 text-gray-800 px-4 py-3 rounded-md mb-6 text-sm font-medium flex items-center gap-2">
              <span className="shrink-0 text-black font-black">!</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-1.5">
                Email or Phone
              </label>
              <input
                type="text"
                name="identifier"
                placeholder="Enter your email or phone"
                value={formData.identifier}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm font-medium text-black placeholder-gray-400 bg-white outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-1.5">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm font-medium text-black placeholder-gray-400 bg-white outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-md font-black text-sm tracking-wide transition-all flex items-center justify-center gap-2 mt-2 bg-black text-white hover:bg-gray-800 active:bg-black disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{" "}
              <Link to="/signup" className="font-black text-black underline underline-offset-4 hover:opacity-70 transition-opacity">
                Sign up here
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center mt-5 text-xs text-gray-400 font-medium">
          ✓ Safe checkout &nbsp;·&nbsp; ✓ Free delivery &nbsp;·&nbsp; ✓ Quality guaranteed
        </p>
      </div>
    </div>
  );
};

export default Login;
