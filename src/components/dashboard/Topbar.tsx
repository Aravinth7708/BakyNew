import { Bell, Settings, ChevronDown } from "lucide-react";

export function Topbar({ title = "Dashboard" }: { title?: string }) {
  return (
    <header className="flex h-[91px] items-center justify-between bg-baky-surface px-6">
      <h1 className="text-2xl font-medium text-black">{title}</h1>

      <div className="flex items-center gap-4">
        <button className="flex h-[49px] items-center gap-3 rounded-xl bg-baky-card px-4 text-[22px] font-medium text-baky-muted">
          Last 7 Days
          <ChevronDown className="h-5 w-5" />
        </button>
        <button className="flex h-[49px] w-[49px] items-center justify-center rounded-xl bg-baky-card text-baky-muted">
          <Bell className="h-6 w-6" strokeWidth={1.5} />
        </button>
        <button className="flex h-[49px] w-[49px] items-center justify-center rounded-xl bg-baky-card text-baky-muted">
          <Settings className="h-6 w-6" strokeWidth={1.5} />
        </button>
        <div className="h-[49px] w-[49px] rounded-full bg-baky-card" />
      </div>
    </header>
  );
}
