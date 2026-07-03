import { createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { InventoryBoard } from "@/components/dashboard/InventoryBoard";

export const Route = createFileRoute("/inventory")({
  head: () => ({
    meta: [
      { title: "Manage Inventory — Baky Dessert House" },
      {
        name: "description",
        content:
          "Manage inventory for Baky Dessert House — track stock levels and low-stock items.",
      },
      { property: "og:title", content: "Manage Inventory — Baky Dessert House" },
      {
        property: "og:description",
        content: "Track stock levels and low-stock items.",
      },
    ],
  }),
  component: Inventory,
});

function Inventory() {
  return (
    <div className="flex min-h-screen bg-white font-sans text-black">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title="Manage Inventory" />

        <main className="flex flex-1 p-6">
          <InventoryBoard />
        </main>
      </div>
    </div>
  );
}
