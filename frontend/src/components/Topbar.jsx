import { Sun, Moon, Bell } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function Topbar() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <header className="flex items-center justify-between px-6 md:px-10 py-6">
      <div>
        <p className="text-sm opacity-60">{greeting},</p>
        <h1 className="text-2xl md:text-3xl font-display font-semibold">
          {user?.fullName?.split(" ")[0] || "there"}
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <button
          aria-label="Notifications"
          className="w-11 h-11 rounded-2xl glass flex items-center justify-center hover:scale-105 transition-transform"
        >
          <Bell size={18} />
        </button>
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="w-11 h-11 rounded-2xl glass flex items-center justify-center hover:scale-105 transition-transform"
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>
    </header>
  );
}
