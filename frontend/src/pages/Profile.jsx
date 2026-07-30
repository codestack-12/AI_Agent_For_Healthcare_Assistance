import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User as UserIcon, Save, Lock, LogOut, CheckCircle2 } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const EMPTY_FORM = {
  fullName: "",
  phone: "",
  age: "",
  gender: "",
  bloodGroup: "",
  medicalHistory: "",
  allergies: "",
  address: "",
  emergencyContact: "",
  preferredLanguage: "en",
};

const inputClass =
  "px-4 py-3 rounded-2xl bg-white/70 dark:bg-white/10 border border-ink/10 dark:border-white/10 outline-none focus:border-teal text-sm";

const initials = (name) =>
  (name || "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("") || "?";

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
  const [pwError, setPwError] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then((res) => {
        const u = res.data.user;
        setForm({
          fullName: u.fullName || "",
          phone: u.phone || "",
          age: u.age ?? "",
          gender: u.gender || "",
          bloodGroup: u.bloodGroup || "",
          medicalHistory: u.medicalHistory || "",
          allergies: u.allergies || "",
          address: u.address || "",
          emergencyContact: u.emergencyContact || "",
          preferredLanguage: u.preferredLanguage || "en",
        });
      })
      .catch(() => setError("Couldn't load your profile."))
      .finally(() => setLoading(false));
  }, [user]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSaved(false);
    setSaving(true);
    try {
      const payload = { ...form, age: form.age === "" ? "" : Number(form.age) };
      const { data } = await api.put("/auth/me", payload);
      updateUser(data.user);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError("");
    setPwSaved(false);

    if (pwForm.newPassword !== pwForm.confirmNewPassword) {
      setPwError("New passwords do not match.");
      return;
    }

    setPwSaving(true);
    try {
      await api.put("/auth/change-password", {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      setPwForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
      setPwSaved(true);
      setTimeout(() => setPwSaved(false), 2500);
    } catch (err) {
      setPwError(err.response?.data?.message || "Failed to change password.");
    } finally {
      setPwSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1">
          <Topbar />
          <main className="px-6 md:px-10 pb-12">
            <div className="glass rounded-card p-6 text-sm flex items-center justify-between gap-4 flex-wrap">
              <span className="opacity-80">Log in to view and edit your profile.</span>
              <a
                href="/login"
                className="bg-teal hover:bg-teal-dark text-white text-sm font-medium px-4 py-2 rounded-2xl transition-colors shrink-0"
              >
                Log in
              </a>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Topbar />

        <main className="px-6 md:px-10 pb-12 flex flex-col gap-6">
          {loading ? (
            <p className="text-sm opacity-60">Loading your profile…</p>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6 items-start">
              {/* Summary card */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-card p-6 flex flex-col items-center text-center gap-3"
              >
                <div className="w-20 h-20 rounded-full bg-teal text-white flex items-center justify-center text-2xl font-display font-semibold">
                  {initials(form.fullName || user.fullName)}
                </div>
                <div>
                  <p className="font-display text-lg font-semibold">{form.fullName || user.fullName}</p>
                  <p className="text-sm opacity-60">{user.email}</p>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-teal/10 text-teal capitalize">
                  {user.role}
                </span>
                <button
                  onClick={logout}
                  className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium text-coral-dark hover:bg-coral/10 transition-colors"
                >
                  <LogOut size={16} /> Log out
                </button>
              </motion.div>

              <div className="lg:col-span-2 flex flex-col gap-6">
                {/* Editable profile */}
                <motion.form
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  onSubmit={handleSave}
                  className="glass rounded-card p-6 flex flex-col gap-4"
                >
                  <div className="flex items-center gap-2 text-sm font-semibold opacity-80">
                    <UserIcon size={16} /> Personal &amp; health details
                  </div>

                  {error && <p className="text-coral-dark text-sm">{error}</p>}

                  <div className="grid sm:grid-cols-2 gap-4">
                    <label className="flex flex-col gap-1.5 text-xs font-medium opacity-70">
                      Full name
                      <input className={inputClass} value={form.fullName} onChange={set("fullName")} required />
                    </label>
                    <label className="flex flex-col gap-1.5 text-xs font-medium opacity-70">
                      Phone number
                      <input className={inputClass} value={form.phone} onChange={set("phone")} required />
                    </label>
                    <label className="flex flex-col gap-1.5 text-xs font-medium opacity-70">
                      Age
                      <input
                        type="number"
                        min="0"
                        max="130"
                        className={inputClass}
                        value={form.age}
                        onChange={set("age")}
                      />
                    </label>
                    <label className="flex flex-col gap-1.5 text-xs font-medium opacity-70">
                      Gender
                      <select className={inputClass} value={form.gender} onChange={set("gender")}>
                        <option value="">Prefer not to say</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </label>
                    <label className="flex flex-col gap-1.5 text-xs font-medium opacity-70">
                      Blood group
                      <input
                        className={inputClass}
                        placeholder="e.g. O+"
                        value={form.bloodGroup}
                        onChange={set("bloodGroup")}
                      />
                    </label>
                    <label className="flex flex-col gap-1.5 text-xs font-medium opacity-70">
                      Emergency contact
                      <input
                        className={inputClass}
                        placeholder="Name & phone number"
                        value={form.emergencyContact}
                        onChange={set("emergencyContact")}
                      />
                    </label>
                    <label className="flex flex-col gap-1.5 text-xs font-medium opacity-70 sm:col-span-2">
                      Address
                      <input className={inputClass} value={form.address} onChange={set("address")} />
                    </label>
                    <label className="flex flex-col gap-1.5 text-xs font-medium opacity-70 sm:col-span-2">
                      Allergies
                      <input
                        className={inputClass}
                        placeholder="e.g. Penicillin, peanuts"
                        value={form.allergies}
                        onChange={set("allergies")}
                      />
                    </label>
                    <label className="flex flex-col gap-1.5 text-xs font-medium opacity-70 sm:col-span-2">
                      Medical history
                      <textarea
                        className={`${inputClass} resize-none`}
                        rows={3}
                        placeholder="Existing conditions, past surgeries, etc."
                        value={form.medicalHistory}
                        onChange={set("medicalHistory")}
                      />
                    </label>
                  </div>

                  <div className="flex items-center gap-3 mt-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex items-center gap-2 bg-teal hover:bg-teal-dark text-white text-sm font-medium px-5 py-2.5 rounded-2xl transition-colors disabled:opacity-50"
                    >
                      <Save size={16} /> {saving ? "Saving…" : "Save changes"}
                    </button>
                    {saved && (
                      <span className="flex items-center gap-1.5 text-leaf text-sm font-medium">
                        <CheckCircle2 size={16} /> Saved
                      </span>
                    )}
                  </div>
                </motion.form>

                {/* Change password */}
                <motion.form
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  onSubmit={handleChangePassword}
                  className="glass rounded-card p-6 flex flex-col gap-4"
                >
                  <div className="flex items-center gap-2 text-sm font-semibold opacity-80">
                    <Lock size={16} /> Change password
                  </div>

                  {pwError && <p className="text-coral-dark text-sm">{pwError}</p>}

                  <div className="grid sm:grid-cols-3 gap-4">
                    <input
                      type="password"
                      required
                      placeholder="Current password"
                      className={inputClass}
                      value={pwForm.currentPassword}
                      onChange={(e) => setPwForm((f) => ({ ...f, currentPassword: e.target.value }))}
                    />
                    <input
                      type="password"
                      required
                      placeholder="New password"
                      className={inputClass}
                      value={pwForm.newPassword}
                      onChange={(e) => setPwForm((f) => ({ ...f, newPassword: e.target.value }))}
                    />
                    <input
                      type="password"
                      required
                      placeholder="Confirm new password"
                      className={inputClass}
                      value={pwForm.confirmNewPassword}
                      onChange={(e) => setPwForm((f) => ({ ...f, confirmNewPassword: e.target.value }))}
                    />
                  </div>
                  <p className="text-xs opacity-50 -mt-1">
                    Use 6+ characters with lowercase, a number, and a symbol.
                  </p>

                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={pwSaving}
                      className="flex items-center gap-2 bg-ink dark:bg-white/10 hover:opacity-90 text-white text-sm font-medium px-5 py-2.5 rounded-2xl transition-colors disabled:opacity-50"
                    >
                      {pwSaving ? "Updating…" : "Update password"}
                    </button>
                    {pwSaved && (
                      <span className="flex items-center gap-1.5 text-leaf text-sm font-medium">
                        <CheckCircle2 size={16} /> Password updated
                      </span>
                    )}
                  </div>
                </motion.form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
