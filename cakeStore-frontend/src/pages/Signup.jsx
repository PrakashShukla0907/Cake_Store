import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signupUser, getProfile, loginUser } from "../api/auth.api";
import { AuthContext } from "../context/AuthContext";

const Signup = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", password: "", confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

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
      const loginRes = await loginUser({ identifier: formData.email, password: formData.password });
      if (loginRes.data?.token) localStorage.setItem("token", loginRes.data.token);
      const profileRes = await getProfile();
      setUser(profileRes.data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 border border-gray-300 rounded-md text-sm font-medium text-black placeholder-gray-400 bg-white outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition-all";

  const labelClass =
    "block text-xs font-black uppercase tracking-widest text-gray-500 mb-1.5";

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black text-black tracking-tight">Create account</h1>
          <p className="mt-1 text-sm text-gray-500 font-medium">Join Gopal Bakers today</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">

          {error && (
            <div className="bg-gray-50 border border-gray-300 text-gray-800 px-4 py-3 rounded-md mb-5 text-sm font-medium flex items-center gap-2">
              <span className="shrink-0 font-black text-black">!</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={labelClass}>Full Name</label>
              <input type="text" name="name" placeholder="Your full name"
                value={formData.name} onChange={handleChange} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" name="email" placeholder="Your email address"
                value={formData.email} onChange={handleChange} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input type="tel" name="phone" placeholder="Your phone number"
                value={formData.phone} onChange={handleChange} maxLength={10} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Password</label>
              <input type="password" name="password" placeholder="Min. 6 characters"
                value={formData.password} onChange={handleChange} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Confirm Password</label>
              <input type="password" name="confirmPassword" placeholder="Re-enter your password"
                value={formData.confirmPassword} onChange={handleChange} required className={inputClass} />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-md font-black text-sm tracking-wide transition-all flex items-center justify-center gap-2 mt-3 bg-black text-white hover:bg-gray-800 active:bg-black disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="font-black text-black underline underline-offset-4 hover:opacity-70 transition-opacity">
                Login here
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

export default Signup;
