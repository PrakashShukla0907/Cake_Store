import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signupUser, getProfile } from "../api/auth.api";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Signup = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const { theme } = useTheme();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await signupUser(formData);

      // auto login after signup
      const profileRes = await getProfile();
      setUser(profileRes.data.user);

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={classNames(
        "min-h-screen flex items-center justify-center pb-12",
        theme === "dark"
          ? "bg-[#2B1B17] text-[#E5D3C5]"
          : "bg-[#F9F1E7] text-[#4A3728]",
      )}
    >
      <div className="w-full max-w-md px-4 sm:px-0">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-5xl mb-3">🍰</h1>
          <h2 className="text-3xl font-bold text-pink-600">CakeStore</h2>
          <p className="text-sm opacity-70 mt-2">Delicious homemade cakes</p>
        </div>

        {/* Signup Card */}
        <div
          className={classNames(
            "rounded-lg p-8 shadow-lg",
            theme === "dark"
              ? "bg-[#3A2A25]"
              : "bg-white border border-gray-200",
          )}
        >
          <h3 className="text-2xl font-bold mb-6 text-center">
            Create Account
          </h3>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
                className={classNames(
                  "w-full px-4 py-2 rounded-lg border-2 focus:outline-none transition",
                  theme === "dark"
                    ? "bg-[#2B1B17] border-[#B97A6A] text-[#E5D3C5] placeholder-[#9D6A5A]"
                    : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400",
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                className={classNames(
                  "w-full px-4 py-2 rounded-lg border-2 focus:outline-none transition",
                  theme === "dark"
                    ? "bg-[#2B1B17] border-[#B97A6A] text-[#E5D3C5] placeholder-[#9D6A5A]"
                    : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400",
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                placeholder="9xxxxxxxxx"
                value={formData.phone}
                onChange={handleChange}
                required
                className={classNames(
                  "w-full px-4 py-2 rounded-lg border-2 focus:outline-none transition",
                  theme === "dark"
                    ? "bg-[#2B1B17] border-[#B97A6A] text-[#E5D3C5] placeholder-[#9D6A5A]"
                    : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400",
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
                className={classNames(
                  "w-full px-4 py-2 rounded-lg border-2 focus:outline-none transition",
                  theme === "dark"
                    ? "bg-[#2B1B17] border-[#B97A6A] text-[#E5D3C5] placeholder-[#9D6A5A]"
                    : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400",
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className={classNames(
                  "w-full px-4 py-2 rounded-lg border-2 focus:outline-none transition",
                  theme === "dark"
                    ? "bg-[#2B1B17] border-[#B97A6A] text-[#E5D3C5] placeholder-[#9D6A5A]"
                    : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400",
                )}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={classNames(
                "w-full py-2 px-4 rounded-lg font-semibold transition flex items-center justify-center gap-2",
                loading
                  ? "opacity-50 cursor-not-allowed"
                  : theme === "dark"
                    ? "bg-[#B97A6A] text-[#E5D3C5] hover:bg-[#9D6A5A]"
                    : "bg-pink-600 text-white hover:bg-pink-700",
              )}
            >
              {loading ? "🔄 Creating Account..." : "✓ Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm opacity-70">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-pink-600 hover:text-pink-700 transition"
              >
                Login here
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

export default Signup;
