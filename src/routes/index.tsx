import { createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { SalesOverviewCard } from "@/components/dashboard/SalesOverviewCard";
import { TopSellingCard } from "@/components/dashboard/TopSellingCard";
import { StatCards } from "@/components/dashboard/StatCards";
import { RecentOrdersCard } from "@/components/dashboard/RecentOrdersCard";
import { LowInventoryCard } from "@/components/dashboard/LowInventoryCard";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="flex min-h-screen bg-white font-sans text-black">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Topbar />

        <main className="flex-1 space-y-6 p-6">
          <div className="grid grid-cols-2 gap-6">
            <SalesOverviewCard />
            <TopSellingCard />
          </div>

          <StatCards />

          <div className="grid grid-cols-[3fr_2fr] gap-6">
            <RecentOrdersCard />
            <LowInventoryCard />
          </div>
        </main>
      </div>
    </div>
  );
}
