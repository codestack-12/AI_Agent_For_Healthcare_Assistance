import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HeartPulse } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await login(form.email, form.password);
    if (res.success) navigate("/dashboard");
    else setError(res.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass rounded-card p-8 w-full max-w-md">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl bg-teal text-white flex items-center justify-center">
            <HeartPulse size={20} />
          </div>
          <span className="font-display text-2xl font-semibold">VedaCare</span>
        </div>

        <h1 className="text-xl font-display font-semibold mb-1">Welcome back</h1>
        <p className="text-sm opacity-60 mb-6">Log in to check on your health today.</p>

        {error && <p className="text-coral-dark text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            required
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="px-4 py-3 rounded-2xl bg-white/70 dark:bg-white/10 border border-ink/10 dark:border-white/10 outline-none focus:border-teal"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="px-4 py-3 rounded-2xl bg-white/70 dark:bg-white/10 border border-ink/10 dark:border-white/10 outline-none focus:border-teal"
          />
          <Link to="/forgot-password" className="text-xs text-teal self-end">
            Forgot password?
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="bg-teal hover:bg-teal-dark text-white font-medium py-3 rounded-2xl transition-colors disabled:opacity-60"
          >
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="text-sm text-center mt-6 opacity-70">
          New here? <Link to="/signup" className="text-teal font-medium">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
