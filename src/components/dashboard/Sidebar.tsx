import {
  LayoutGrid,
  MonitorSmartphone,
  ShoppingCart,
  UtensilsCrossed,
  FileCheck,
  Store,
  Info,
  LogOut,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

const linkItems = [
  { label: "Dashboard", icon: LayoutGrid, to: "/", exact: true },
  { label: "POS", icon: MonitorSmartphone, to: "/pos", exact: false },
  { label: "Orders", icon: ShoppingCart, to: "/orders", exact: false },
  { label: "Menu", icon: UtensilsCrossed, to: "/menu", exact: false },
  { label: "Inventory", icon: FileCheck, to: "/inventory", exact: false },
  { label: "Manage", icon: Store, to: "/manage", exact: false },
] as const;

const stubItems = [
  { label: "Help Center", icon: Info },
] as const;

export function Sidebar() {
  return (
    <aside className="flex w-[321px] shrink-0 flex-col bg-baky-surface px-4 py-8">
      {/* Brand */}
      <div className="flex items-center gap-3 px-2">
        <img 
          src="/Baky logo .png" 
          alt="Baky Logo" 
          className="h-12 w-12 object-contain" 
        />
        <div className="leading-tight">
          <p className="text-2xl font-medium text-black">Baky Dessert House</p>
          <p className="text-lg font-light text-black">Management</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="mt-14 flex flex-col gap-2">
        {linkItems.map(({ label, icon: Icon, to, exact }) => (
          <Link
            key={label}
            to={to}
            activeOptions={{ exact }}
            className="flex items-center gap-4 rounded-[13px] px-4 py-3 text-left text-2xl font-medium text-black transition-colors hover:bg-baky-card/60 [&.active]:bg-baky-card"
          >
            {({ isActive }) => (
              <>
                <Icon
                  className="h-7 w-7"
                  style={{ color: isActive ? "#000000" : "#8b8b8b" }}
                  strokeWidth={1.75}
                />
                {label}
              </>
            )}
          </Link>
        ))}
        {stubItems.map(({ label, icon: Icon }) => (
          <button
            key={label}
            className="flex items-center gap-4 rounded-[13px] px-4 py-3 text-left text-2xl font-medium text-black transition-colors hover:bg-baky-card/60"
          >
            <Icon className="h-7 w-7" style={{ color: "#8b8b8b" }} strokeWidth={1.75} />
            {label}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <button className="mt-auto flex items-center gap-4 rounded-[13px] px-4 py-3 text-left text-2xl font-medium text-black hover:bg-baky-card/60">
        <LogOut className="h-7 w-7" strokeWidth={1.75} />
        Logout
      </button>
    </aside>
  );
}
