import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HeartPulse } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { signup, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await signup(form);
    if (res.success) navigate("/dashboard");
    else setError(res.message);
  };

  const field = (name, type, placeholder) => (
    <input
      type={type}
      required
      placeholder={placeholder}
      value={form[name]}
      onChange={(e) => setForm({ ...form, [name]: e.target.value })}
      className="px-4 py-3 rounded-2xl bg-white/70 dark:bg-white/10 border border-ink/10 dark:border-white/10 outline-none focus:border-teal"
    />
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="glass rounded-card p-8 w-full max-w-md">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl bg-teal text-white flex items-center justify-center">
            <HeartPulse size={20} />
          </div>
          <span className="font-display text-2xl font-semibold">VedaCare</span>
        </div>

        <h1 className="text-xl font-display font-semibold mb-1">Create your account</h1>
        <p className="text-sm opacity-60 mb-6">A few details to get your dashboard set up.</p>

        {error && <p className="text-coral-dark text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {field("fullName", "text", "Full name")}
          {field("email", "email", "Email")}
          {field("phone", "tel", "Phone number")}
          {field("password", "password", "Password")}
          {field("confirmPassword", "password", "Confirm password")}
          <p className="text-xs opacity-50 -mt-2">
            Use 8+ characters with a mix of upper/lowercase, a number, and a symbol.
          </p>
          <button
            type="submit"
            disabled={loading}
            className="bg-teal hover:bg-teal-dark text-white font-medium py-3 rounded-2xl transition-colors disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Sign up"}
          </button>
        </form>

        <p className="text-sm text-center mt-6 opacity-70">
          Already have an account? <Link to="/login" className="text-teal font-medium">Log in</Link>
        </p>
      </div>
    </div>
  );
}
