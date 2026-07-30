import { NavLink } from "react-router-dom";
import { LayoutDashboard, MessageCircle, MapPin, Pill, User, LogOut, LogIn, HeartPulse } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/chat", label: "AI Assistant", icon: MessageCircle },
  // { to: "/hospitals", label: "Hospitals", icon: MapPin },
  // { to: "/medicine", label: "Medicines", icon: Pill },
  { to: "/profile", label: "Profile", icon: User },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="hidden md:flex md:flex-col w-64 shrink-0 h-screen sticky top-0 border-r border-ink/5 dark:border-white/5 p-6">
      <div className="flex items-center gap-2 mb-10">
        <div className="w-9 h-9 rounded-xl bg-teal text-white flex items-center justify-center">
          <HeartPulse size={18} />
        </div>
        <span className="font-display text-xl font-semibold">VedaCare</span>
      </div>

      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-teal text-white"
                  : "hover:bg-teal/10 dark:hover:bg-white/5 opacity-80 hover:opacity-100"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {user ? (
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-coral-dark hover:bg-coral/10 transition-colors"
        >
          <LogOut size={18} />
          Log out
        </button>
      ) : (
        <NavLink
          to="/login"
          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-teal hover:bg-teal/10 transition-colors"
        >
          <LogIn size={18} />
          Log in
        </NavLink>
      )}
    </aside>
  );
}
